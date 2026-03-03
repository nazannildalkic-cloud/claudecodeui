import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Key, ExternalLink, Eye, EyeOff, Save } from 'lucide-react';
import SessionProviderLogo from '../SessionProviderLogo';
import { OPENROUTER_MODELS, GROQ_MODELS, GEMINI_MODELS } from '../../../shared/modelConstants';

const providerConfig = {
  openrouter: {
    name: 'OpenRouter',
    description: 'Access 100+ AI models via a single API. DeepSeek, Mistral, Llama, Gemini and more.',
    signupUrl: 'https://openrouter.ai/keys',
    signupLabel: 'Get API Key at openrouter.ai',
    pricing: 'Pay per token - most models under $1/M tokens',
    models: OPENROUTER_MODELS,
    bgClass: 'bg-indigo-50 dark:bg-indigo-900/20',
    borderClass: 'border-indigo-200 dark:border-indigo-800',
    textClass: 'text-indigo-900 dark:text-indigo-100',
    subtextClass: 'text-indigo-700 dark:text-indigo-300',
    buttonClass: 'bg-indigo-600 hover:bg-indigo-700',
  },
  groq: {
    name: 'Groq',
    description: 'Ultra-fast AI inference. Free tier available with generous limits.',
    signupUrl: 'https://console.groq.com/keys',
    signupLabel: 'Get API Key at groq.com',
    pricing: 'Free tier: 30 req/min, 14,400 req/day',
    models: GROQ_MODELS,
    bgClass: 'bg-orange-50 dark:bg-orange-900/20',
    borderClass: 'border-orange-200 dark:border-orange-800',
    textClass: 'text-orange-900 dark:text-orange-100',
    subtextClass: 'text-orange-700 dark:text-orange-300',
    buttonClass: 'bg-orange-600 hover:bg-orange-700',
  },
  gemini: {
    name: 'Google Gemini',
    description: 'Google AI models. Free tier with 15 req/min for Flash models.',
    signupUrl: 'https://aistudio.google.com/apikey',
    signupLabel: 'Get API Key at aistudio.google.com',
    pricing: 'Free tier: 15 req/min (Flash), paid plans available',
    models: GEMINI_MODELS,
    bgClass: 'bg-sky-50 dark:bg-sky-900/20',
    borderClass: 'border-sky-200 dark:border-sky-800',
    textClass: 'text-sky-900 dark:text-sky-100',
    subtextClass: 'text-sky-700 dark:text-sky-300',
    buttonClass: 'bg-sky-600 hover:bg-sky-700',
  },
};

export default function ApiKeyAccountContent({ provider }) {
  const config = providerConfig[provider];
  const storageKey = `${provider}-api-key`;

  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setApiKey(stored);
      setHasKey(true);
    } else {
      setApiKey('');
      setHasKey(false);
    }
    setSaved(false);
  }, [provider, storageKey]);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem(storageKey, apiKey.trim());
      setHasKey(true);
    } else {
      localStorage.removeItem(storageKey);
      setHasKey(false);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    localStorage.removeItem(storageKey);
    setApiKey('');
    setHasKey(false);
    setSaved(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <SessionProviderLogo provider={provider} className="w-6 h-6" />
        <div>
          <h3 className="text-lg font-medium text-foreground">{config.name}</h3>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>
      </div>

      <div className={`${config.bgClass} border ${config.borderClass} rounded-lg p-4`}>
        <div className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className={`font-medium ${config.textClass}`}>Connection Status</div>
              <div className={`text-sm ${config.subtextClass}`}>
                {hasKey ? 'API key configured' : 'No API key set'}
              </div>
            </div>
            <div>
              {hasKey ? (
                <Badge variant="success" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  Configured
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                  Not configured
                </Badge>
              )}
            </div>
          </div>

          {/* API Key Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className={`font-medium mb-2 ${config.textClass}`}>
              <Key className="w-4 h-4 inline mr-2" />
              API Key
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`Enter your ${config.name} API key...`}
                  className="pr-10 font-mono text-sm"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button onClick={handleSave} className={`${config.buttonClass} text-white`} size="sm">
                <Save className="w-4 h-4 mr-1" />
                {saved ? 'Saved!' : 'Save'}
              </Button>
              {hasKey && (
                <Button onClick={handleClear} variant="outline" size="sm">
                  Clear
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Key is stored locally in your browser. Never sent to our servers.
            </p>
          </div>

          {/* Get API Key Link */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <div className={`font-medium ${config.textClass}`}>Get an API Key</div>
                <div className={`text-sm ${config.subtextClass}`}>{config.pricing}</div>
              </div>
              <a
                href={config.signupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-white text-sm ${config.buttonClass}`}
              >
                <ExternalLink className="w-4 h-4" />
                {config.signupLabel}
              </a>
            </div>
          </div>

          {/* Available Models */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className={`font-medium mb-2 ${config.textClass}`}>Available Models</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {config.models.OPTIONS.map((model) => (
                <div key={model.value} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
                  <span className="truncate" title={model.value}>{model.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
