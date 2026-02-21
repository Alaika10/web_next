'use client';

import { useEffect, useMemo, useState } from 'react';

const roles = ['Data Scientist', 'AI Engineer'];
const TYPING_SPEED = 90;
const DELETING_SPEED = 55;
const HOLD_DURATION = 2000;

export default function TypingRole() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const longestRole = useMemo(
    () => roles.reduce((longest, role) => (role.length > longest.length ? role : longest), roles[0]),
    []
  );

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
    <span className="relative inline-block align-baseline text-indigo-600 dark:text-indigo-300">
      <span className="invisible">{longestRole}</span>
      <span className="absolute inset-0 inline-flex items-center whitespace-nowrap">
        <span>{displayedText}</span>
        <span className="typing-caret ml-1" aria-hidden="true" />
      </span>
      <span className="sr-only">{roles[roleIndex]}</span>
    </span>
  );
}
