
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
        'fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <div className="h-[300px] rounded-t-2xl border-t border-border bg-accent/95 p-4 pb-20 shadow-lg backdrop-blur-md">
        <div className="relative flex h-full flex-col items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-2 top-2 rounded-full"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>

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
