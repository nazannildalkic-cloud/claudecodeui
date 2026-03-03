/**
 * OpenAI-Compatible Provider
 * ==========================
 *
 * Generic provider for any OpenAI-compatible API (OpenRouter, Groq, Gemini, etc.)
 * Supports streaming chat completions via the standard /v1/chat/completions endpoint.
 *
 * ## Usage
 *
 * - queryOpenAICompat(command, options, ws) - Execute a prompt with streaming via WebSocket
 * - abortOpenAICompatSession(sessionId) - Cancel an active session
 * - isOpenAICompatSessionActive(sessionId) - Check if a session is running
 */

import { OPENROUTER_MODELS, GROQ_MODELS, GEMINI_MODELS } from '../shared/modelConstants.js';

const activeSessions = new Map();

// Conversation history per session for multi-turn chat
const sessionHistories = new Map();

/**
 * Get provider config by name
 */
function getProviderConfig(provider) {
  switch (provider) {
    case 'openrouter':
      return {
        name: 'OpenRouter',
        baseUrl: OPENROUTER_MODELS.BASE_URL,
        defaultModel: OPENROUTER_MODELS.DEFAULT,
        envKey: 'OPENROUTER_API_KEY',
        extraHeaders: {
          'HTTP-Referer': 'https://cloudcli.ai',
          'X-Title': 'Claude Code UI'
        }
      };
    case 'groq':
      return {
        name: 'Groq',
        baseUrl: GROQ_MODELS.BASE_URL,
        defaultModel: GROQ_MODELS.DEFAULT,
        envKey: 'GROQ_API_KEY',
        extraHeaders: {}
      };
    case 'gemini':
      return {
        name: 'Gemini',
        baseUrl: GEMINI_MODELS.BASE_URL,
        defaultModel: GEMINI_MODELS.DEFAULT,
        envKey: 'GEMINI_API_KEY',
        extraHeaders: {}
      };
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

/**
 * Build the system prompt for coding assistance
 */
function buildSystemPrompt(projectPath) {
  return `You are an expert AI coding assistant. You help with software engineering tasks including writing code, debugging, explaining code, and more.

${projectPath ? `The user is working in the project directory: ${projectPath}` : ''}

Be concise and helpful. When writing code, use proper formatting with markdown code blocks.`;
}

/**
 * Execute a query against an OpenAI-compatible API with streaming
 * @param {string} command - The user prompt
 * @param {object} options - Options including provider, model, apiKey, sessionId, projectPath
 * @param {WebSocket|object} ws - WebSocket connection or response writer
 */
export async function queryOpenAICompat(command, options = {}, ws) {
  const {
    provider = 'openrouter',
    model,
    apiKey,
    sessionId,
    projectPath,
    cwd
  } = options;

  const config = getProviderConfig(provider);
  const resolvedApiKey = apiKey || process.env[config.envKey];

  if (!resolvedApiKey) {
    sendMessage(ws, {
      type: `${provider}-error`,
      error: `No API key configured for ${config.name}. Set ${config.envKey} environment variable or add it in Settings.`,
      sessionId
    });
    return;
  }

  const resolvedModel = model || config.defaultModel;
  const currentSessionId = sessionId || `${provider}-${Date.now()}`;
  const workingDirectory = cwd || projectPath || process.cwd();
  const abortController = new AbortController();

  try {
    // Track the session
    activeSessions.set(currentSessionId, {
      provider,
      status: 'running',
      abortController,
      startedAt: new Date().toISOString()
    });

    // Send session created event
    sendMessage(ws, {
      type: 'session-created',
      sessionId: currentSessionId,
      provider
    });

    // Build or retrieve conversation history
    let history = sessionHistories.get(currentSessionId);
    if (!history) {
      history = [
        { role: 'system', content: buildSystemPrompt(workingDirectory) }
      ];
      sessionHistories.set(currentSessionId, history);
    }

    // Add the user message
    history.push({ role: 'user', content: command });

    // Build request URL
    const url = `${config.baseUrl}/chat/completions`;

    // Build request body
    const body = {
      model: resolvedModel,
      messages: history,
      stream: true,
      max_tokens: 4096
    };

    // Build headers
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resolvedApiKey}`,
      ...config.extraHeaders
    };

    // Make the streaming request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: abortController.signal
    });

    if (!response.ok) {
      let errorText;
      try {
        const errorBody = await response.json();
        errorText = errorBody.error?.message || errorBody.error || JSON.stringify(errorBody);
      } catch {
        errorText = await response.text();
      }

      sendMessage(ws, {
        type: `${provider}-error`,
        error: `${config.name} API error (${response.status}): ${errorText}`,
        sessionId: currentSessionId
      });
      return;
    }

    // Process SSE stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullContent = '';
    let inputTokens = 0;
    let outputTokens = 0;

    while (true) {
      const session = activeSessions.get(currentSessionId);
      if (!session || session.status === 'aborted') {
        break;
      }

      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;

        const data = trimmed.slice(6);
        if (data === '[DONE]') continue;

        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta;

          if (delta?.content) {
            fullContent += delta.content;

            sendMessage(ws, {
              type: `${provider}-response`,
              data: {
                type: 'content_block_delta',
                delta: { text: delta.content }
              },
              sessionId: currentSessionId
            });
          }

          // Capture usage if provided (some providers include it)
          if (parsed.usage) {
            inputTokens = parsed.usage.prompt_tokens || 0;
            outputTokens = parsed.usage.completion_tokens || 0;
          }
        } catch {
          // Skip malformed JSON lines
        }
      }
    }

    // Save assistant response to history
    if (fullContent) {
      history.push({ role: 'assistant', content: fullContent });
    }

    // Send token usage
    if (inputTokens || outputTokens) {
      sendMessage(ws, {
        type: 'token-budget',
        data: {
          used: inputTokens + outputTokens,
          total: 128000
        },
        sessionId: currentSessionId
      });
    }

    // Send completion event
    sendMessage(ws, {
      type: `${provider}-complete`,
      sessionId: currentSessionId,
      usage: {
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens
      }
    });

  } catch (error) {
    const session = activeSessions.get(currentSessionId);
    const wasAborted =
      session?.status === 'aborted' ||
      error?.name === 'AbortError' ||
      String(error?.message || '').toLowerCase().includes('aborted');

    if (!wasAborted) {
      console.error(`[${config.name}] Error:`, error);
      sendMessage(ws, {
        type: `${provider}-error`,
        error: error.message,
        sessionId: currentSessionId
      });
    }
  } finally {
    const session = activeSessions.get(currentSessionId);
    if (session) {
      session.status = session.status === 'aborted' ? 'aborted' : 'completed';
    }
  }
}

/**
 * Abort an active session
 */
export function abortOpenAICompatSession(sessionId) {
  const session = activeSessions.get(sessionId);
  if (!session) return false;

  session.status = 'aborted';
  try {
    session.abortController?.abort();
  } catch (error) {
    console.warn(`[OpenAI-Compat] Failed to abort session ${sessionId}:`, error);
  }
  return true;
}

/**
 * Check if a session is active
 */
export function isOpenAICompatSessionActive(sessionId) {
  const session = activeSessions.get(sessionId);
  return session?.status === 'running';
}

/**
 * Get all active sessions
 */
export function getActiveOpenAICompatSessions() {
  const sessions = [];
  for (const [id, session] of activeSessions.entries()) {
    if (session.status === 'running') {
      sessions.push({ id, provider: session.provider, status: session.status, startedAt: session.startedAt });
    }
  }
  return sessions;
}

/**
 * Clear session history (for new conversations)
 */
export function clearSessionHistory(sessionId) {
  sessionHistories.delete(sessionId);
}

/**
 * Helper to send message via WebSocket or writer
 */
function sendMessage(ws, data) {
  try {
    if (ws.isSSEStreamWriter || ws.isWebSocketWriter) {
      ws.send(data);
    } else if (typeof ws.send === 'function') {
      ws.send(JSON.stringify(data));
    }
  } catch (error) {
    console.error('[OpenAI-Compat] Error sending message:', error);
  }
}

// Clean up old sessions periodically
setInterval(() => {
  const now = Date.now();
  const maxAge = 30 * 60 * 1000;

  for (const [id, session] of activeSessions.entries()) {
    if (session.status !== 'running') {
      const startedAt = new Date(session.startedAt).getTime();
      if (now - startedAt > maxAge) {
        activeSessions.delete(id);
        sessionHistories.delete(id);
      }
    }
  }
}, 5 * 60 * 1000);
