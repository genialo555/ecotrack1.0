'use client';

import { useEffect, useState } from 'react';

interface TypeWriterProps {
  text: string;
  delay?: number;
  className?: string;
  speed?: number;
}

export const TypeWriter = ({ text, delay = 0, className = '', speed = 50 }: TypeWriterProps) => {
  const [displayText, setDisplayText] = useState('');
  const [startTyping, setStartTyping] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStartTyping(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!startTyping) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, startTyping]);

  return (
    <span className={className}>
      {displayText}
      {displayText.length < text.length && (
        <span className="inline-block w-0.5 h-5 bg-current animate-cursor-blink" />
      )}
    </span>
  );
};
