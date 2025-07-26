
'use client';
import { Input } from '@/components/ui/input';
import { VoiceButton } from './voice/VoiceButton';
import { ProfileMenu } from './ProfileMenu';
import { Camera } from 'lucide-react';

export function AssistantBar() {
  return (
    <footer className="fixed bottom-16 left-0 right-0 z-20 p-2 md:bottom-0">
      <div className="relative mx-auto max-w-4xl">
        <div className="flex w-full items-center gap-2 rounded-lg border bg-background/95 p-2 shadow-lg backdrop-blur-sm">
          <button className="flex-shrink-0 p-2 text-muted-foreground hover:text-primary">
            <Camera className="h-5 w-5" />
            <span className="sr-only">Upload Image</span>
          </button>
          <Input
            placeholder="Ask anything or type a command..."
            className="flex-grow border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
          <VoiceButton />
          <div className="hidden md:block">
            <ProfileMenu />
          </div>
        </div>
      </div>
    </footer>
  );
}
