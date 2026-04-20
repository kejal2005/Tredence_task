import React, { useState } from 'react';
import { cn } from '@lib/cn';

interface TooltipProps {
  content:   string;
  children:  React.ReactElement;
  side?:     'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  side = 'top',
  className,
}) => {
  const [visible, setVisible] = useState(false);

  const POSITIONS: Record<string, string> = {
    top:    'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    left:   'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right:  'left-full top-1/2 -translate-y-1/2 ml-1.5',
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className={cn(
            'pointer-events-none absolute z-50 whitespace-nowrap rounded-lg',
            'bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg',
            POSITIONS[side],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};
