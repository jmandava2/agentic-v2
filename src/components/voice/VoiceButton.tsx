
'use client';
import { Mic } from 'lucide-react';
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
    <button
      onClick={handleToggleListening}
      className={cn(
        'relative flex flex-col items-center gap-1 p-2 rounded-md text-xs font-medium transition-colors text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        isListening && 'text-primary'
      )}
    >
      <Mic className="h-5 w-5" />
      <span>Assistant</span>
       {isListening && (
        <span className="absolute top-1 right-1 z-0 h-2 w-2 rounded-full bg-primary animate-ping"></span>
      )}
      <span className="sr-only">
        {isListening ? 'Stop listening' : 'Start voice command'}
      </span>
    </button>
  );
}
