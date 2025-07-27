
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { assistantChat } from '@/ai/flows/assistant-chat';
import type { AssistantChatOutput } from '@/ai/flows/assistant-chat';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { useToast } from './use-toast';
import { useLanguage } from './use-language';
import { useRouter } from 'next/navigation';

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
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const [state, setState] = useState(voiceState);
  const [hasRecognitionSupport, setHasRecognitionSupport] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onNoSupport]);


  const stopListening = useCallback(() => {
    console.log('stopListening called');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (recognitionRef) {
      recognitionRef.onresult = null;
      recognitionRef.onend = null;
      recognitionRef.onerror = null;
      recognitionRef.onstart = null;
      recognitionRef.stop();
      recognitionRef = null;
      console.log('Recognition stopped.');
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setGlobalVoiceState({ isListening: false, transcript: '' });
  }, []);

  const handleAssistantResponse = useCallback(async (response: AssistantChatOutput) => {
    setGlobalVoiceState({ transcript: response.response });

    if (response.toolRequest) {
        if (response.toolRequest.tool.name === 'navigateToPage') {
            const page = response.toolRequest.input.page;
            router.push(`/${page}`);
        } else if (response.toolRequest.tool.name === 'changeLanguage') {
            const lang = response.toolRequest.input.language;
            setLanguage(lang);
        }
        timeoutRef.current = setTimeout(stopListening, 3000);
        return;
    }

    try {
      const audioResponse = await textToSpeech({ text: response.response, language });
      if (audioResponse.media && audioRef.current) {
        audioRef.current.src = audioResponse.media;
        audioRef.current.play();
        audioRef.current.onended = () => {
          timeoutRef.current = setTimeout(stopListening, 4000);
        };
      } else {
        timeoutRef.current = setTimeout(stopListening, 4000);
      }
    } catch (err) {
      console.error("TTS error:", err);
      timeoutRef.current = setTimeout(stopListening, 4000);
    }
  }, [language, stopListening, router, setLanguage]);

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
    recognition.interimResults = true;
    recognition.lang = language === 'kn' ? 'kn-IN' : 'en-US';
    recognitionRef = recognition;

    recognition.onstart = () => {
      console.log('Voice recognition started.');
      setGlobalVoiceState({ isListening: true, transcript: '' });
    };

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                setGlobalVoiceState({ transcript: event.results[i][0].transcript });
            }
        }
        
        if (finalTranscript) {
            console.log('Final voice input received:', finalTranscript);
            recognition.stop();
            try {
                setGlobalVoiceState({ transcript: 'Thinking...' });
                const chatResponse = await assistantChat({ query: finalTranscript });
                console.log('Assistant response:', chatResponse);
                await handleAssistantResponse(chatResponse);
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
      if (event.error !== 'aborted' && event.error !== 'no-speech' && event.error !== 'audio-capture') {
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
          // If it ends prematurely (e.g., silence), and we haven't received a final transcript, stop everything.
          const currentTranscript = voiceState.transcript;
          if (!currentTranscript || currentTranscript === 'Thinking...') {
             stopListening();
          }
        }
    };

    recognition.start();

  }, [language, stopListening, toast, handleAssistantResponse]);

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
