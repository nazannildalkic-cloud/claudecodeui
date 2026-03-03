import type { SessionProvider } from '../types/app';
import ClaudeLogo from './ClaudeLogo';
import CodexLogo from './CodexLogo';
import CursorLogo from './CursorLogo';

type SessionProviderLogoProps = {
  provider?: SessionProvider | string | null;
  className?: string;
};

function ProviderTextLogo({ text, bgColor, className }: { text: string; bgColor: string; className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill={bgColor} />
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="system-ui">{text}</text>
    </svg>
  );
}

export default function SessionProviderLogo({
  provider = 'claude',
  className = 'w-5 h-5',
}: SessionProviderLogoProps) {
  if (provider === 'cursor') {
    return <CursorLogo className={className} />;
  }

  if (provider === 'codex') {
    return <CodexLogo className={className} />;
  }

  if (provider === 'openrouter') {
    return <ProviderTextLogo text="OR" bgColor="#6366f1" className={className} />;
  }

  if (provider === 'groq') {
    return <ProviderTextLogo text="G" bgColor="#f97316" className={className} />;
  }

  if (provider === 'gemini') {
    return <ProviderTextLogo text="Ge" bgColor="#4285f4" className={className} />;
  }

  return <ClaudeLogo className={className} />;
}
