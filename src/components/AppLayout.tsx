
'use client';

import { type ReactNode } from 'react';
import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { AssistantBar } from '@/components/AssistantBar';
import { BottomNav } from '@/components/BottomNav';
import { useVoiceRecognition } from '@/hooks/use-voice-recognition';
import { VoiceOverlay } from './voice/VoiceOverlay';

export function AppLayout({ children }: { children: ReactNode }) {
  const { isListening, transcript, stopListening } = useVoiceRecognition();
  return (
    <>
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
    </>
  );
}
