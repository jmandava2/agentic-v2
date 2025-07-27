import * as React from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className, ...props }: React.HTMLAttributes<SVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      className={cn('h-full w-full', className)}
      {...props}
    >
      <path
        fill="currentColor"
        d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88Z"
      />
      <path
        fill="currentColor"
        d="M128 104a8 8 0 0 0-8 8v40a8 8 0 0 0 16 0v-40a8 8 0 0 0-8-8Zm-36.11-8.62a8 8 0 0 0-10.47 4.19C69.59 126 78.25 149.25 96.65 160.6a8 8 0 1 0 7.37-13.84c-13.9-8.34-20.2-25.79-22.91-38a8 8 0 0 0-11-5.14Zm82.69 4.19a8 8 0 0 0-10.47-4.19c-2.71 12.21-9 29.66-22.91 38a8 8 0 1 0 7.37 13.84c18.4-11.35 27.06-34.56 25.24-51.18a8 8 0 0 0-9.23-6.65Z"
      />
    </svg>
  );
}
