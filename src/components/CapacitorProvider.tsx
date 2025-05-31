'use client';

import { useEffect } from 'react';
import { initializeApp, setupAppListeners } from '@/lib/capacitor';

export default function CapacitorProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const init = async () => {
      await initializeApp();
      setupAppListeners();
    };

    init();
  }, []);

  return <>{children}</>;
} 