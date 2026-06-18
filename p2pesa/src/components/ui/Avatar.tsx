'use client';

import React from 'react';
import Image from 'next/image';
import { FiUser } from 'react-icons/fi';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: number;
  initials?: string;
  className?: string;
}

export function Avatar({
  src,
  alt,
  size = 48,
  initials = '?',
  className = '',
}: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);
  const baseClasses = `object-cover border border-brand-border bg-brand-surface flex items-center justify-center ${className}`;

  if (src && !imgError) {
    return (
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={`rounded-sm ${baseClasses}`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className={`rounded-sm text-brand-muted font-mono-tech ${baseClasses}`}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
      aria-label={alt}
    >
      {initials && initials !== '?' ? (
        <span>{initials.slice(0, 2).toUpperCase()}</span>
      ) : (
        <FiUser className="text-brand-muted opacity-80" style={{ width: size * 0.45, height: size * 0.45 }} />
      )}
    </div>
  );
}
