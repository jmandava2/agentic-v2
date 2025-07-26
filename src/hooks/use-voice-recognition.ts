
'use client';

import { useState, useEffect, useRef } from 'react';
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
  'go to health check': '/health-check',
  'open health check': '/health-check',
  'start health check': '/health-check',
  'go to yield': '/yield-check',
  'open yield check': '/yield-check',
  'add yield': '/yield-check',
  'log out': '/',
  'sign out': '/',
};

type CommandKey = keyof typeof commands;

export const useVoiceRecognition = (props: UseVoiceRecognitionProps = {}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [hasRecognitionSupport, setHasRecognitionSupport] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

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
        const currentTranscript = event.results[0][0].transcript.toLowerCase().trim();
        setTranscript(currentTranscript);
        processCommand(currentTranscript);
      };

      recognition.onstart = () => {
        setIsListening(true);
        toast({ title: 'Listening...', description: 'Please speak your command.' });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        toast({
          variant: 'destructive',
          title: 'Voice Error',
          description: event.error,
        });
      };

      recognitionRef.current = recognition;
    } else {
      setHasRecognitionSupport(false);
      props.onNoSupport?.();
    }
  }, [router, toast, props]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const processCommand = (command: string) => {
    const foundCommand = Object.keys(commands).find(key =>
      command.includes(key)
    ) as CommandKey | undefined;

    if (foundCommand) {
      const path = commands[foundCommand];
      toast({
        title: 'Command Recognized',
        description: `Navigating to ${path === '/' ? 'Landing Page' : path}...`,
      });
      router.push(path);
    } else {
      toast({
        variant: 'destructive',
        title: 'Command not recognized',
        description: `Could not understand: "${command}"`,
      });
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
