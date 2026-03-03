/**
 * Centralized Model Definitions
 * Single source of truth for all supported AI models
 */

/**
 * Claude (Anthropic) Models
 *
 * Note: Claude uses two different formats:
 * - SDK format ('sonnet', 'opus') - used by the UI and claude-sdk.js
 * - API format ('claude-sonnet-4.5') - used by slash commands for display
 */
export const CLAUDE_MODELS = {
  // Models in SDK format (what the actual SDK accepts)
  OPTIONS: [
    { value: 'sonnet', label: 'Sonnet' },
    { value: 'opus', label: 'Opus' },
    { value: 'haiku', label: 'Haiku' },
    { value: 'opusplan', label: 'Opus Plan' },
    { value: 'sonnet[1m]', label: 'Sonnet [1M]' }
  ],

  DEFAULT: 'sonnet'
};

/**
 * Cursor Models
 */
export const CURSOR_MODELS = {
  OPTIONS: [
    { value: 'gpt-5.2-high', label: 'GPT-5.2 High' },
    { value: 'gemini-3-pro', label: 'Gemini 3 Pro' },
    { value: 'opus-4.5-thinking', label: 'Claude 4.5 Opus (Thinking)' },
    { value: 'gpt-5.2', label: 'GPT-5.2' },
    { value: 'gpt-5.1', label: 'GPT-5.1' },
    { value: 'gpt-5.1-high', label: 'GPT-5.1 High' },
    { value: 'composer-1', label: 'Composer 1' },
    { value: 'auto', label: 'Auto' },
    { value: 'sonnet-4.5', label: 'Claude 4.5 Sonnet' },
    { value: 'sonnet-4.5-thinking', label: 'Claude 4.5 Sonnet (Thinking)' },
    { value: 'opus-4.5', label: 'Claude 4.5 Opus' },
    { value: 'gpt-5.1-codex', label: 'GPT-5.1 Codex' },
    { value: 'gpt-5.1-codex-high', label: 'GPT-5.1 Codex High' },
    { value: 'gpt-5.1-codex-max', label: 'GPT-5.1 Codex Max' },
    { value: 'gpt-5.1-codex-max-high', label: 'GPT-5.1 Codex Max High' },
    { value: 'opus-4.1', label: 'Claude 4.1 Opus' },
    { value: 'grok', label: 'Grok' }
  ],

  DEFAULT: 'gpt-5'
};

/**
 * Codex (OpenAI) Models
 */
export const CODEX_MODELS = {
  OPTIONS: [
    { value: 'gpt-5.3-codex', label: 'GPT-5.3 Codex' },
    { value: 'gpt-5.2-codex', label: 'GPT-5.2 Codex' },
    { value: 'gpt-5.2', label: 'GPT-5.2' },
    { value: 'gpt-5.1-codex-max', label: 'GPT-5.1 Codex Max' },
    { value: 'o3', label: 'O3' },
    { value: 'o4-mini', label: 'O4-mini' }
  ],

  DEFAULT: 'gpt-5.3-codex'
};

/**
 * OpenRouter Models
 * Access 100+ models via a single API (openrouter.ai)
 * Prices shown per 1M tokens (input/output)
 */
export const OPENROUTER_MODELS = {
  OPTIONS: [
    { value: 'deepseek/deepseek-chat-v3-0324', label: 'DeepSeek V3 ($0.14/$0.28)' },
    { value: 'deepseek/deepseek-reasoner', label: 'DeepSeek R1 ($0.55/$2.19)' },
    { value: 'google/gemini-2.5-flash-preview', label: 'Gemini 2.5 Flash ($0.15/$0.60)' },
    { value: 'google/gemini-2.5-pro-preview', label: 'Gemini 2.5 Pro ($1.25/$10)' },
    { value: 'mistralai/codestral-2501', label: 'Codestral ($0.30/$0.90)' },
    { value: 'mistralai/mistral-large-2411', label: 'Mistral Large ($2/$6)' },
    { value: 'meta-llama/llama-4-maverick', label: 'Llama 4 Maverick ($0.20/$0.60)' },
    { value: 'meta-llama/llama-4-scout', label: 'Llama 4 Scout ($0.15/$0.40)' },
    { value: 'qwen/qwen-2.5-coder-32b-instruct', label: 'Qwen 2.5 Coder 32B ($0.06/$0.06)' },
    { value: 'anthropic/claude-sonnet-4', label: 'Claude Sonnet 4 ($3/$15)' }
  ],

  DEFAULT: 'deepseek/deepseek-chat-v3-0324',
  BASE_URL: 'https://openrouter.ai/api/v1'
};

/**
 * Groq Models
 * Ultra-fast inference with free tier (groq.com)
 */
export const GROQ_MODELS = {
  OPTIONS: [
    { value: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B' },
    { value: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B Instant' },
    { value: 'llama3-70b-8192', label: 'Llama 3 70B' },
    { value: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B' },
    { value: 'gemma2-9b-it', label: 'Gemma 2 9B' },
    { value: 'deepseek-r1-distill-llama-70b', label: 'DeepSeek R1 Distill 70B' }
  ],

  DEFAULT: 'llama-3.3-70b-versatile',
  BASE_URL: 'https://api.groq.com/openai/v1'
};

/**
 * Google Gemini Models
 * Via Google AI Studio API (aistudio.google.com)
 */
export const GEMINI_MODELS = {
  OPTIONS: [
    { value: 'gemini-2.5-flash-preview-05-20', label: 'Gemini 2.5 Flash' },
    { value: 'gemini-2.5-pro-preview-05-06', label: 'Gemini 2.5 Pro' },
    { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
    { value: 'gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash Lite (Free)' },
    { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
    { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' }
  ],

  DEFAULT: 'gemini-2.5-flash-preview-05-20',
  BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/openai'
};
