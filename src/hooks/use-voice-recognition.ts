
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './use-toast';

type UseVoiceRecognitionProps = {
  onNoSupport?: () => void;
};

const commands = {
  'go to dashboard': '/dashboard',
  'open dashboard': '/dashboard',
  'show me the dashboard': '/dashboard',
  'go to market': '/market-advisory',
  'open market advisory': '/market-advisory',
  'check prices': '/market-advisory',
  'go to check-in': '/check-in',
  'open check-in': '/check-in',
  'start check-in': '/check-in',
  'go to schemes': '/schemes',
  'open schemes': '/schemes',
  'log out': '/',
  'sign out': '/',
};

type CommandKey = keyof typeof commands;

// Global state management for voice overlay
const listeners = new Set<(state: boolean) => void>();
let isListeningGlobally = false;

const notifyListeners = () => {
  listeners.forEach((listener) => listener(isListeningGlobally));
};

const setGlobalListening = (state: boolean) => {
  isListeningGlobally = state;
  notifyListeners();
};

export const useVoiceRecognition = (props: UseVoiceRecognitionProps = {}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(isListeningGlobally);
  const [transcript, setTranscript] = useState('');
  const [hasRecognitionSupport, setHasRecognitionSupport] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const processCommand = useCallback(
    (command: string) => {
      const foundCommand = Object.keys(commands).find((key) =>
        command.includes(key)
      ) as CommandKey | undefined;

      if (foundCommand) {
        const path = commands[foundCommand];
        toast({
          title: 'Command Recognized',
          description: `Navigating to ${
            path === '/' ? 'Landing Page' : path
          }...`,
        });
        router.push(path);
      } else {
        toast({
          variant: 'destructive',
          title: 'Command not recognized',
          description: `Could not understand: "${command}"`,
        });
      }
      stopListening();
    },
    [router, toast, stopListening]
  );

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setHasRecognitionSupport(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US'; // Could be extended to 'kn-IN' for Kannada
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const currentTranscript = event.results[0][0].transcript
          .toLowerCase()
          .trim();
        setTranscript(currentTranscript);
        processCommand(currentTranscript);
      };

      recognition.onstart = () => {
        setGlobalListening(true);
      };

      recognition.onend = () => {
        setGlobalListening(false);
        setTranscript('');
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (event.error !== 'no-speech') {
          toast({
            variant: 'destructive',
            title: 'Voice Error',
            description: event.error,
          });
        }
        setGlobalListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setHasRecognitionSupport(false);
      props.onNoSupport?.();
    }
  }, [processCommand, props, toast]);

  useEffect(() => {
    const listener = (state: boolean) => {
      setIsListening(state);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListeningGlobally) {
      recognitionRef.current.start();
    }
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    hasRecognitionSupport,
  };
};
