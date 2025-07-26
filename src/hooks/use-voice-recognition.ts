
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
      recognitionRef.onresult = null;
      recognitionRef.onend = null;
      recognitionRef.onerror = null;
      recognitionRef.onstart = null;
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

    setGlobalVoiceState({ isListening: true, transcript: '' });

    if (recognitionRef) {
      recognitionRef.stop();
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true; // Enable interim results
    recognition.lang = language === 'kn' ? 'kn-IN' : 'en-US';
    recognitionRef = recognition;

    recognition.onstart = () => {
      console.log('Voice recognition started.');
      setGlobalVoiceState({ isListening: true, transcript: '' });
    };

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = 0; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        
        setGlobalVoiceState({ transcript: finalTranscript || interimTranscript });

        if (finalTranscript) {
            console.log('Final voice input received:', finalTranscript);
            try {
                setGlobalVoiceState({ transcript: 'Thinking...' });
                const chatResponse = await assistantChat({ query: finalTranscript });

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
                  audioRef.current.onended = () => {
                    setTimeout(() => stopListening(), 2000);
                  };
                } else {
                  setTimeout(() => stopListening(), 2000);
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
        // The overlay closing logic is now handled exclusively in onresult.
        // This handler is intentionally left blank to prevent premature closing.
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
    isListening: state.isListening,
    transcript: state.transcript,
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
