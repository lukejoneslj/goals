'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { triggerHapticFeedback } from '@/lib/capacitor';
import { ImpactStyle } from '@capacitor/haptics';

interface BackButtonProps {
  fallbackUrl?: string;
  className?: string;
}

export default function BackButton({ fallbackUrl = '/', className = '' }: BackButtonProps) {
  const router = useRouter();

  const handleBack = async () => {
    await triggerHapticFeedback(ImpactStyle.Light);
    
    // Try to go back in history first
    if (window.history.length > 1) {
      router.back();
    } else {
      // If no history, go to fallback URL
      router.push(fallbackUrl);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleBack}
      className={`fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-sm shadow-lg safe-top ${className}`}
      aria-label="Go back"
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
  );
} 