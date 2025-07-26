
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { assistantChat } from '@/ai/flows/assistant-chat';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { useToast } from './use-toast';

type UseVoiceRecognitionProps = {
  onNoSupport?: () => void;
};

// Check for SpeechRecognition API
const SpeechRecognition =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

export const useVoiceRecognition = (props: UseVoiceRecognitionProps = {}) => {
  const { onNoSupport } = props;
  const { toast } = useToast();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [hasRecognitionSupport, setHasRecognitionSupport] = useState(!!SpeechRecognition);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!SpeechRecognition) {
      onNoSupport?.();
      setHasRecognitionSupport(false);
    }
    // Clean up audio element on unmount
    return () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.remove();
        }
    }
  }, [onNoSupport]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsListening(false);
    setTranscript('');
  }, []);

  const startListening = useCallback(() => {
    if (isListening || !SpeechRecognition) {
      return;
    }

    setIsListening(true);
    setTranscript('Listening...');

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        // Already set state, just log
      console.log('Voice recognition started.');
    };

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const capturedTranscript = event.results[0][0].transcript;
      setTranscript(`You said: "${capturedTranscript}"`);
      console.log('Voice input received:', capturedTranscript);

      try {
        setTranscript('Thinking...');
        const chatResponse = await assistantChat({ query: capturedTranscript });
        console.log('Gemini response:', chatResponse.response);
        setTranscript(chatResponse.response);

        const audioResponse = await textToSpeech(chatResponse.response);
        
        if (audioResponse.media) {
            if (!audioRef.current) {
                audioRef.current = new Audio();
                document.body.appendChild(audioRef.current);
            }
            audioRef.current.src = audioResponse.media;
            audioRef.current.play();
            audioRef.current.onended = () => {
                stopListening(); 
            };
        } else {
            stopListening();
        }

      } catch (error) {
        console.error('Error processing voice input:', error);
        toast({
            variant: 'destructive',
            title: 'Voice Assistant Error',
            description: 'Sorry, I encountered an error.'
        });
        stopListening();
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
       if (event.error !== 'aborted') {
            toast({
                variant: 'destructive',
                title: 'Voice Error',
                description: `An error occurred: ${event.error}`
            });
       }
      stopListening();
    };

    recognition.onend = () => {
        // stopListening() is called by onresult or onerror, so this is just a final check.
        if (isListening) {
           stopListening();
        }
    };
    
    recognitionRef.current = recognition;
    recognition.start();

  }, [isListening, toast, stopListening]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    hasRecognitionSupport,
  };
};

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
  }
}
