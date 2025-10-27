'use client';

import { useState, useEffect, useRef } from 'react';

interface FlipCharacterProps {
  target: string;
  className?: string;
}

const CHARACTERS = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-.';

export default function FlipCharacter({ target, className = '' }: FlipCharacterProps) {
  // Initialize displayChar with target to show immediately
  const [displayChar, setDisplayChar] = useState(target);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevTargetRef = useRef(target);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (target !== prevTargetRef.current) {
      setIsAnimating(true);
      
      const currentIndex = CHARACTERS.indexOf(displayChar);
      const targetIndex = CHARACTERS.indexOf(target);
      
      // Calculate shortest path
      let steps: number;
      if (Math.abs(targetIndex - currentIndex) <= CHARACTERS.length / 2) {
        steps = targetIndex - currentIndex;
      } else {
        steps = targetIndex > currentIndex 
          ? -(CHARACTERS.length - targetIndex + currentIndex)
          : CHARACTERS.length + targetIndex - currentIndex;
      }

      // Animate through characters
      let currentStep = 0;
      const direction = steps > 0 ? 1 : -1;
      const totalSteps = Math.abs(steps);
      
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setInterval(() => {
        currentStep++;
        const newIndex = currentIndex + (currentStep * direction);
        setDisplayChar(CHARACTERS[newIndex]);
        
        if (currentStep === totalSteps) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setDisplayChar(target);
          setIsAnimating(false);
        }
      }, 50); // 50ms per character

      prevTargetRef.current = target;
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [target]);

  return (
    <span className={`flip-character ${className}`}>
      <span className={`flip-flap ${isAnimating ? 'animating' : ''}`}>
        <span className="flip-front font-mono" style={{ color: '#ffff00' }}>
          {displayChar}
        </span>
        <span className="flip-back font-mono" style={{ color: '#ffff00' }}>
          {target}
        </span>
      </span>
    </span>
  );
}

