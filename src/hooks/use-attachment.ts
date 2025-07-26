
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type AttachmentContextType = {
  attachment: string | null;
  setAttachment: (attachment: string | null) => void;
};

const AttachmentContext = createContext<AttachmentContextType | undefined>(undefined);

export function AttachmentProvider({ children }: { children: ReactNode }) {
  const [attachment, setAttachment] = useState<string | null>(null);

  return (
    <AttachmentContext.Provider value={{ attachment, setAttachment }}>
      {children}
    </AttachmentContext.Provider>
  );
}

export const useAttachment = () => {
  const context = useContext(AttachmentContext);
  if (context === undefined) {
    throw new Error('useAttachment must be used within an AttachmentProvider');
  }
  return context;
};
