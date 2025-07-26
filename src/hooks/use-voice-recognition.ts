
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { assistantChat } from '@/ai/flows/assistant-chat';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { useToast } from './use-toast';

type UseVoiceRecognitionProps = {
  onNoSupport?: () => void;
};

// Check for SpeechRecognition API
const getSpeechRecognition = () =>
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

export const useVoiceRecognition = (props: UseVoiceRecognitionProps = {}) => {
  const { onNoSupport } = props;
  const { toast } = useToast();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [hasRecognitionSupport, setHasRecognitionSupport] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      setHasRecognitionSupport(false);
      onNoSupport?.();
    } else {
      setHasRecognitionSupport(true);
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
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
        return;
    }

    setIsListening(true);
    setTranscript('Listening...');

    if (recognitionRef.current) {
        recognitionRef.current.stop();
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      console.log('Voice recognition started.');
      setIsListening(true);
    };

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const capturedTranscript = event.results[0][0].transcript;
      setTranscript(`You said: "${capturedTranscript}"`);
      console.log('Voice input received:', capturedTranscript);

      try {
        setTranscript('Thinking...');
        const chatResponse = await assistantChat({ query: capturedTranscript });
        
        if (chatResponse.toolRequest && chatResponse.toolRequest.name === 'navigateToPage') {
            const page = chatResponse.toolRequest.input.page;
            setTranscript(`Navigating to ${page}...`);
            window.location.assign(`/${page}`);
            // Don't play audio or stop listening immediately, let the page redirect.
            return;
        }

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
       if (event.error !== 'aborted' && event.error !== 'no-speech') {
            toast({
                variant: 'destructive',
                title: 'Voice Error',
                description: `An error occurred: ${event.error}`
            });
       }
      stopListening();
    };

    recognition.onend = () => {
       if (isListening) {
         // This is to handle cases where recognition ends prematurely
         stopListening();
       }
    };
    
    recognition.start();

  }, [toast, stopListening, isListening]);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };


  return {
    isListening,
    transcript,
    startListening: handleToggleListening, // Use the toggler
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
