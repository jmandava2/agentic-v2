'use client';

import { createContext, useContext } from 'react';

type AttachmentContextType = {
  attachment: string | null;
  setAttachment: (attachment: string | null) => void;
};

export const AttachmentContext = createContext<AttachmentContextType | undefined>(undefined);

export const useAttachment = () => {
  const context = useContext(AttachmentContext);
  if (context === undefined) {
    throw new Error('useAttachment must be used within an AttachmentProvider');
  }
  return context;
};
