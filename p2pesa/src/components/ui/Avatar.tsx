'use client';

/**
 * src/components/ui/Avatar.tsx — Profile picture with fallback
 */

import React from 'react';
import Image from 'next/image';

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

  if (src && !imgError) {
    return (
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={`rounded-full object-cover border-2 border-brand-orange ${className}`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className={`
        rounded-full bg-gradient-to-br from-brand-orange to-amber-600
        flex items-center justify-center font-bold text-white
        border-2 border-brand-orange
        ${className}
      `}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      aria-label={alt}
    >
      {initials[0]?.toUpperCase() ?? '?'}
    </div>
  );
}
