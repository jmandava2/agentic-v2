
'use client';
import { Mic } from 'lucide-react';
import { useVoiceRecognition } from '@/hooks/use-voice-recognition';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';

export function VoiceButton() {
  const { toast } = useToast();
  const {
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
  } = useVoiceRecognition({
    onNoSupport: () =>
      toast({
        variant: 'destructive',
        title: 'Voice recognition not supported',
        description: 'Your browser does not support voice commands.',
      }),
  });

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!hasRecognitionSupport) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleListening}
      className={cn(
        'relative flex-shrink-0 rounded-full bg-foreground text-primary transition-shadow hover:bg-foreground/90'
      )}
    >
      <Mic className="h-5 w-5" />
      <span className="sr-only">
        {isListening ? 'Stop listening' : 'Start voice command'}
      </span>
    </Button>
  );
}
