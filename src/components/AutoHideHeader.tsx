'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AutoHideHeaderProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number; // How much to scroll before hiding
}

export default function AutoHideHeader({ 
  children, 
  className = '', 
  threshold = 50 
}: AutoHideHeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show header when at top of page
      if (currentScrollY <= 0) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }
      
      // Show/hide based on scroll direction and threshold
      if (Math.abs(currentScrollY - lastScrollY) > threshold) {
        if (currentScrollY > lastScrollY) {
          // Scrolling down - hide header
          setIsVisible(false);
        } else {
          // Scrolling up - show header
          setIsVisible(true);
        }
        setLastScrollY(currentScrollY);
      }
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [lastScrollY, threshold]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out safe-top',
        isVisible ? 'translate-y-0' : '-translate-y-full',
        className
      )}
    >
      {children}
    </header>
  );
} 