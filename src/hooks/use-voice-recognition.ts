
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { assistantChat } from '@/ai/flows/assistant-chat';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { useToast } from './use-toast';

type UseVoiceRecognitionProps = {
  onNoSupport?: () => void;
};

export const useVoiceRecognition = (props: UseVoiceRecognitionProps = {}) => {
  const { onNoSupport } = props;
  const { toast } = useToast();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [hasRecognitionSupport, setHasRecognitionSupport] = useState(true);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // This effect runs once on mount to initialize speech recognition.
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setHasRecognitionSupport(false);
      onNoSupport?.();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('Listening...');
    };

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const capturedTranscript = event.results[0][0].transcript;
      setTranscript(`You said: "${capturedTranscript}"`);
      console.log('Voice input received:', capturedTranscript);

      try {
        setTranscript('Thinking...');
        // 1. Get text response from Gemini
        const chatResponse = await assistantChat({ query: capturedTranscript });
        console.log('Gemini response:', chatResponse.response);
        setTranscript(chatResponse.response);

        // 2. Convert response to speech
        const audioResponse = await textToSpeech(chatResponse.response);
        
        // 3. Play the audio
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
            description: 'Sorry, I encountered an error processing your request.'
        });
        stopListening();
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        setTranscript('I didn\'t hear anything. Try again?');
      } else {
        toast({
            variant: 'destructive',
            title: 'Voice Error',
            description: `An error occurred: ${event.error}`
        });
      }
      setIsListening(false);
    };

    recognition.onend = () => {
        // Don't set isListening to false immediately, wait for audio to finish.
        // It will be set to false in the onended handler of the audio element or after an error.
    };

    recognitionRef.current = recognition;

    return () => {
        recognition.stop();
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.remove();
        }
    }

  }, [onNoSupport, toast]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
     if (audioRef.current) {
        audioRef.current.pause();
    }
    setIsListening(false);
    setTranscript('');
  }, []);


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
