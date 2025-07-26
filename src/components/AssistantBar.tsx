
'use client';
import { Input } from '@/components/ui/input';
import { VoiceButton } from './voice/VoiceButton';
import { ProfileMenu } from './ProfileMenu';
import { Button } from './ui/button';
import { Camera } from 'lucide-react';
import { useCamera } from '@/hooks/use-camera';

export function AssistantBar() {
  const { openCamera } = useCamera();
  return (
    <footer className="fixed bottom-16 left-0 right-0 z-20 p-2 md:bottom-0">
      <div className="relative mx-auto max-w-4xl">
        <div className="flex w-full items-center gap-3 rounded-full border bg-background/95 p-2 shadow-lg backdrop-blur-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={openCamera}
            className="flex-shrink-0 rounded-full bg-foreground text-primary transition-shadow hover:bg-foreground/90"
          >
            <Camera className="h-5 w-5" />
            <span className="sr-only">Upload Image</span>
          </Button>
          <Input
            placeholder="Ask anything or type a command..."
            className="flex-grow border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
          <VoiceButton />
          <div className="hidden flex-shrink-0 md:block">
            <ProfileMenu />
          </div>
        </div>
      </div>
    </footer>
  );
}
