
'use client';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { VoiceButton } from './voice/VoiceButton';
import { ProfileMenu } from './ProfileMenu';
import { Button } from './ui/button';
import { Camera, Send, X } from 'lucide-react';
import { useCamera } from '@/hooks/use-camera';
import { useAttachment } from '@/hooks/use-attachment';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useVoiceRecognition } from '@/hooks/use-voice-recognition';
import { useLanguage } from '@/hooks/use-language';

export function AssistantBar() {
  const { isCameraOpen, openCamera } = useCamera();
  const { isListening } = useVoiceRecognition();
  const { attachment, setAttachment } = useAttachment();
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const { t } = useLanguage();

  const handleSendMessage = () => {
    if (!message && !attachment) return;
    // Mock sending message
    toast({
      title: 'Message Sent (Mock)',
      description: `Text: ${message || '(none)'}, Image: ${attachment ? 'Attached' : 'None'}`,
    });
    setMessage('');
    setAttachment(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <footer className="fixed bottom-16 left-0 right-0 z-20 p-2 md:bottom-0">
      <div className="relative mx-auto max-w-4xl">
        <div className="flex w-full items-center gap-3 rounded-full border bg-card p-2 pl-4 shadow-lg">
          {attachment && (
            <div className="relative flex-shrink-0">
              <Image
                src={attachment}
                alt="Attachment preview"
                width={32}
                height={32}
                className="rounded-md object-cover"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-destructive/80 text-destructive-foreground"
                onClick={() => setAttachment(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {!attachment && (
             <Button
              variant="ghost"
              size="icon"
              onClick={openCamera}
              disabled={isListening || isCameraOpen}
              className="h-8 w-8 flex-shrink-0 rounded-full bg-foreground text-primary transition-shadow hover:bg-foreground/90"
            >
              <Camera className="h-4 w-4" />
              <span className="sr-only">{t('assistant.upload')}</span>
            </Button>
          )}

          <Input
            placeholder={t('assistant.placeholder')}
            className="flex-grow border-0 bg-transparent shadow-none focus-visible:ring-0 truncate"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <VoiceButton />

          <Button
            variant="ghost"
            size="icon"
            onClick={handleSendMessage}
            disabled={isListening || isCameraOpen}
            className="h-8 w-8 flex-shrink-0 rounded-full bg-foreground text-primary transition-shadow hover:bg-foreground/90"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">{t('assistant.send')}</span>
          </Button>

          <div className="hidden flex-shrink-0 md:block">
            <ProfileMenu />
          </div>
        </div>
      </div>
    </footer>
  );
}
