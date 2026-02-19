'use client';

import { useEffect, useState } from 'react';

const roles = ['Data Scientist', 'AI Engineer'];
const TYPING_SPEED = 90;
const DELETING_SPEED = 55;
const HOLD_DURATION = 1400;

export default function TypingRole() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting && displayedText.length < currentRole.length) {
        setDisplayedText(currentRole.slice(0, displayedText.length + 1));
        return;
      }

      if (!isDeleting && displayedText.length === currentRole.length) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && displayedText.length > 0) {
        setDisplayedText(currentRole.slice(0, displayedText.length - 1));
        return;
      }

      if (isDeleting && displayedText.length === 0) {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }
    }, displayedText.length === currentRole.length && !isDeleting ? HOLD_DURATION : isDeleting ? DELETING_SPEED : TYPING_SPEED);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, roleIndex]);

  return (
    <span className="inline-flex items-center">
      {displayedText}
      <span className="ml-1 inline-block h-[1em] w-[2px] animate-pulse bg-current" aria-hidden="true" />
      <span className="sr-only">{roles[roleIndex]}</span>
    </span>
  );
}
