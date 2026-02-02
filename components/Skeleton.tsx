'use client';
import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
}

export default function Skeleton({ className = '', variant = 'rect' }: SkeletonProps) {
  const baseStyles = "animate-pulse bg-slate-200 dark:bg-slate-800";
  const variantStyles = {
    rect: "rounded-2xl",
    circle: "rounded-full",
    text: "rounded-md h-4 w-full"
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`} />
  );
}