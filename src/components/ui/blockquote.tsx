import React from 'react';
import { cn } from '@/lib/utils/css';

type BlockquoteProps = {
  children?: React.ReactNode;
  className?: string;
};

const Blockquote = ({ children, className }: BlockquoteProps) => {
  return (
    <div
      className={cn(
        "relative rounded border-l-4 border-l-neutral-700 dark:border-l-neutral-300 bg-neutral-100 dark:bg-neutral-900 py-4 pl-8 pr-4 font-sans italic leading-relaxed text-neutral-500 dark:text-neutral-400 before:absolute before:left-3 before:top-3 before:font-serif before:text-3xl before:text-neutral-700 dark:before:text-neutral-300 before:content-['“']",
        className,
      )}
    >
      {children}
    </div>
  );
};

const BlockquoteAuthor = ({ children, className }: BlockquoteProps) => {
  return (
    <p className={cn('mt-2 pr-4 text-right font-bold not-italic text-neutral-700 dark:text-neutral-300', className)}>
      - {children}
    </p>
  );
};

export { Blockquote, BlockquoteAuthor };
