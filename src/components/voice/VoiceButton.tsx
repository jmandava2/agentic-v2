
'use client';
import { Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceRecognition } from '@/hooks/use-voice-recognition';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function VoiceButton() {
  const { toast } = useToast();
  const { isListening, startListening, stopListening, hasRecognitionSupport } =
    useVoiceRecognition({
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
      variant="outline"
      size="icon"
      onClick={handleToggleListening}
      className={cn(
        'relative rounded-full',
        isListening && 'bg-primary/20 text-primary-foreground'
      )}
    >
      <Mic className="h-5 w-5" />
      {isListening && (
        <span className="absolute inset-0 z-0 h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
      )}
      <span className="sr-only">
        {isListening ? 'Stop listening' : 'Start voice command'}
      </span>
    </Button>
  );
}
