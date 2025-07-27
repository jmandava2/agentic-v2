
'use client';

import { useState, useCallback } from 'react';

type CameraOptions = {
    onCapture?: (dataUrl: string) => void;
}

const listeners = new Set<(state: boolean) => void>();
let isCameraOpenGlobally = false;
let globalOnCapture: ((dataUrl: string) => void) | undefined = undefined;

const notifyListeners = () => {
  listeners.forEach((listener) => listener(isCameraOpenGlobally));
};

const setGlobalCameraOpen = (state: boolean, onCapture?: (dataUrl: string) => void) => {
  isCameraOpenGlobally = state;
  globalOnCapture = onCapture;
  notifyListeners();
};

export const useCamera = (options: CameraOptions = {}) => {
  const { onCapture } = options;
  const [isCameraOpen, setIsCameraOpen] = useState(isCameraOpenGlobally);

  const openCamera = useCallback(() => {
    setGlobalCameraOpen(true, onCapture);
  }, [onCapture]);

  const closeCamera = useCallback(() => {
    setGlobalCameraOpen(false, undefined);
  }, []);

  useState(() => {
    const listener = (state: boolean) => {
      setIsCameraOpen(state);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  });

  return {
    isCameraOpen,
    openCamera,
    closeCamera,
    onCapture: globalOnCapture
  };
};
