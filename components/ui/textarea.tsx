import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-lg border border-ax-border bg-white px-3 py-2 text-sm text-ax-text',
          'placeholder:text-ax-text-muted',
          'focus:outline-none focus:ring-2 focus:ring-ax-primary/20 focus:border-ax-primary',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'resize-none transition-colors',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
