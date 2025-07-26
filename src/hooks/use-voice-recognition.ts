
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { assistantChat } from '@/ai/flows/assistant-chat';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { useToast } from './use-toast';
import { useLanguage } from './use-language';

type UseVoiceRecognitionProps = {
  onNoSupport?: () => void;
};

// --- Global State Management ---
type VoiceState = {
  isListening: boolean;
  transcript: string;
};
const listeners = new Set<(state: VoiceState) => void>();
let voiceState: VoiceState = {
  isListening: false,
  transcript: '',
};

const notifyListeners = () => {
  listeners.forEach((listener) => listener(voiceState));
};

const setGlobalVoiceState = (newState: Partial<VoiceState>) => {
  voiceState = { ...voiceState, ...newState };
  notifyListeners();
};
// -----------------------------


// Check for SpeechRecognition API
const getSpeechRecognition = () =>
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

let recognitionRef: SpeechRecognition | null = null;
const audioRef = { current: typeof window !== 'undefined' ? new Audio() : null };


export const useVoiceRecognition = (props: UseVoiceRecognitionProps = {}) => {
  const { onNoSupport } = props;
  const { toast } = useToast();
  const { language } = useLanguage();
  const [state, setState] = useState(voiceState);
  const [hasRecognitionSupport, setHasRecognitionSupport] = useState(false);
  
  // Effect for setting up listeners and checking for support
  useEffect(() => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      setHasRecognitionSupport(false);
      onNoSupport?.();
    } else {
      setHasRecognitionSupport(true);
    }
    
    const listener = (newState: VoiceState) => setState(newState);
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [onNoSupport]);


  const stopListening = useCallback(() => {
    if (recognitionRef) {
      recognitionRef.stop();
      recognitionRef = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setGlobalVoiceState({ isListening: false, transcript: '' });
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition || voiceState.isListening) {
      return;
    }

    setGlobalVoiceState({ isListening: true, transcript: 'Listening...' });

    if (recognitionRef) {
      recognitionRef.stop();
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === 'kn' ? 'kn-IN' : 'en-US';
    recognitionRef = recognition;

    recognition.onstart = () => {
      console.log('Voice recognition started.');
      setGlobalVoiceState({ isListening: true, transcript: 'Listening...' });
    };

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const capturedTranscript = event.results[0][0].transcript;
      setGlobalVoiceState({ transcript: `You said: "${capturedTranscript}"` });
      console.log('Voice input received:', capturedTranscript);

      try {
        setGlobalVoiceState({ transcript: 'Thinking...' });
        const chatResponse = await assistantChat({ query: capturedTranscript });

        if (chatResponse.toolRequest && chatResponse.toolRequest.tool.name === 'navigateToPage') {
          const page = chatResponse.toolRequest.input.page;
          setGlobalVoiceState({ transcript: `Navigating to ${page}...` });
          setTimeout(() => {
            window.location.assign(`/${page}`);
            stopListening();
          }, 1000);
          return;
        }

        console.log('Gemini response:', chatResponse.response);
        setGlobalVoiceState({ transcript: chatResponse.response });

        const audioResponse = await textToSpeech({ text: chatResponse.response, language });

        if (audioResponse.media && audioRef.current) {
          audioRef.current.src = audioResponse.media;
          audioRef.current.play();
          audioRef.current.onended = stopListening;
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
      if (voiceState.isListening) {
        stopListening();
      }
    };

    recognition.start();

  }, [language, stopListening, toast]);

  const toggleListening = useCallback(() => {
    if (voiceState.isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [startListening, stopListening]);


  return {
    ...state,
    startListening: toggleListening,
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
