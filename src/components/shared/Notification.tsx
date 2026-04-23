'use client';

import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
const notificationStyles = {
  dark: 'bg-violet-950 border border-gray-border text-saffron px-6 md:px-2.5 py-1 text-sm rounded-2xl sm:rounded-full',
  violet: 'bg-grape text-light-gray text-sm rounded-3xl px-6 py-0.5 ',
  yellow: 'bg-yellow text-dark-blue text-sm rounded-3xl px-6 py-0.5 ',
};

export interface NotificationProps {
  onClose?: () => void;
  closeButton?: boolean;
  variant?: 'dark' | 'violet' | 'yellow';
  children?: React.ReactNode;
  className?: string;
  text?: string;
}

export function Notification({ className, closeButton, variant, children, text, onClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsVisible(false);

    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className={twMerge('relative', variant && notificationStyles[variant], className)}>
      {text}
      {children}
      {closeButton && (
        <span
          className="cbi-close-circle absolute inset-y-0 right-0 h-full -translate-x-[20%] px-1 text-base"
          onClick={handleClose}
        ></span>
      )}
    </div>
  );
}
