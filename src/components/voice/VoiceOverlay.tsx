
'use client';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoiceVisualizer } from './VoiceVisualizer';
import { cn } from '@/lib/utils';

type VoiceOverlayProps = {
  isOpen: boolean;
  transcript: string;
  onClose: () => void;
};

export function VoiceOverlay({
  isOpen,
  transcript,
  onClose,
}: VoiceOverlayProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <div className="relative h-full w-full bg-accent/95 p-4 shadow-lg backdrop-blur-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full text-foreground"
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </Button>
        <div className="flex h-full flex-col items-center justify-center">
          <div className="flex-grow" />

          <VoiceVisualizer />

          <div className="mt-8 flex h-16 items-center text-center">
            <p className="text-xl text-foreground">
              {transcript || 'Say something...'}
            </p>
          </div>

          <div className="flex-grow" />
        </div>
      </div>
    </div>
  );
}
