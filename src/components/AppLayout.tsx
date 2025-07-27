
'use client';

import { type ReactNode, useState, createContext } from 'react';
import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { AssistantBar } from '@/components/AssistantBar';
import { BottomNav } from '@/components/BottomNav';
import { useVoiceRecognition } from '@/hooks/use-voice-recognition';
import { VoiceOverlay } from './voice/VoiceOverlay';
import { useCamera } from '@/hooks/use-camera';
import { AttachmentContext } from '@/hooks/use-attachment';
import { CameraOverlay } from './camera/CameraOverlay';
import type { Farm } from './dashboard/FarmInfoCarousel';

type AppContextType = {
  farms: Farm[];
  setFarms: React.Dispatch<React.SetStateAction<Farm[]>>;
  activeFarmId: number | null;
  setActiveFarmId: React.Dispatch<React.SetStateAction<number | null>>;
};

export const AppContext = createContext<AppContextType | null>(null);

function AppProvider({ children }: { children: ReactNode }) {
  const [attachment, setAttachment] = useState<string | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [activeFarmId, setActiveFarmId] = useState<number | null>(null);


  return (
    <AppContext.Provider value={{ farms, setFarms, activeFarmId, setActiveFarmId }}>
      <AttachmentContext.Provider value={{ attachment, setAttachment }}>
        {children}
      </AttachmentContext.Provider>
    </AppContext.Provider>
  );
}


export function AppLayout({ children }: { children: ReactNode }) {
  const { isListening, transcript, stopListening } = useVoiceRecognition();
  const { isCameraOpen, closeCamera } = useCamera();
  return (
    <AppProvider>
      <Sidebar variant="sidebar" collapsible="icon">
        <AppSidebar />
      </Sidebar>
      <SidebarInset className="p-4 md:p-6 pb-40 md:pb-24">{children}</SidebarInset>
      <AssistantBar />
      <BottomNav />
      <VoiceOverlay
        isOpen={isListening}
        transcript={transcript}
        onClose={stopListening}
      />
      <CameraOverlay isOpen={isCameraOpen} onClose={closeCamera} />
    </AppProvider>
  );
}
