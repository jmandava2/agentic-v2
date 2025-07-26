
'use client';

import { useState, useCallback } from 'react';

type UseVoiceRecognitionProps = {
  onNoSupport?: () => void;
};

// All voice logic has been removed as per the request.
// The hook now returns a "dummy" state to prevent breaking the UI.

export const useVoiceRecognition = (props: UseVoiceRecognitionProps = {}) => {
  const [isListening] = useState(false);
  const [transcript] = useState('');
  const [hasRecognitionSupport] = useState(true); // Keep UI visible

  const startListening = useCallback(() => {
    // No-op
  }, []);

  const stopListening = useCallback(() => {
    // No-op
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    hasRecognitionSupport,
  };
};
