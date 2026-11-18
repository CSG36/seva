import { useState } from 'react';
import { Landmark } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export function ImageWithFallback({
  src,
  alt,
  className = '',
  fallbackLabel = 'Karnataka Public Services',
}: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#0F1E36] via-[#1E3A5F] to-[#134E4A] text-white p-6 ${className}`}
      >
        <Landmark className="w-10 h-10 text-[#FBBF24] mb-3" aria-hidden="true" />
        <p className="text-sm font-medium text-center text-slate-100">{fallbackLabel}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
