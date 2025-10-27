'use client';

import FlipCharacter from './FlipCharacter';

interface FlipTextProps {
  text: string;
  className?: string;
}

export default function FlipText({ text, className = '' }: FlipTextProps) {
  return (
    <span className={`inline-flex ${className}`}>
      {Array.from(text).map((char, index) => (
        <FlipCharacter 
          key={`${char}-${index}`} 
          target={char}
        />
      ))}
    </span>
  );
}

