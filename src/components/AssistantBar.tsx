
'use client';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { VoiceButton } from './voice/VoiceButton';
import { ProfileMenu } from './ProfileMenu';
import { Button } from './ui/button';
import { Camera, Send, X, Loader2 } from 'lucide-react';
import { useCamera } from '@/hooks/use-camera';
import { useAttachment } from '@/hooks/use-attachment';
import { useToast } from '@/hooks/use-toast';
import { useState, useContext } from 'react';
import { cn } from '@/lib/utils';
import { useVoiceRecognition } from '@/hooks/use-voice-recognition';
import { useLanguage } from '@/hooks/use-language';
import { assistantChat } from '@/ai/flows/assistant-chat';
import { useRouter } from 'next/navigation';
import { AppContext } from './AppLayout';
import { format } from 'date-fns';
import type { FarmHistory } from './dashboard/FarmInfoCard';

export function AssistantBar() {
  const { attachment, setAttachment } = useAttachment();
  const appContext = useContext(AppContext);
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const handleCapture = (photoDataUrl: string) => {
    if (!appContext) return;
    const { activeFarmId, setFarms, farms } = appContext;
    
    if (activeFarmId === null) {
      toast({
        variant: 'destructive',
        title: 'No Active Crop',
        description: 'Please select a crop from the dashboard carousel first.',
      });
      return;
    }

    const newHistoryEntry: FarmHistory = {
      date: format(new Date(), 'MMM d, yyyy'),
      event: 'Photo Check-in',
      details: 'Visual inspection log captured via camera.',
      photo: true,
    };
    
    setFarms(prevFarms => 
      prevFarms.map(farm => 
        farm.id === activeFarmId 
          ? { ...farm, history: [newHistoryEntry, ...farm.history] } 
          : farm
      )
    );

    const activeFarm = farms.find(f => f.id === activeFarmId);
    if (activeFarm) {
        toast({
            title: 'Check-in Logged',
            description: `New photo log added to the history of ${t(activeFarm.cropNameKey as any)}.`,
        });
    }

    setAttachment(photoDataUrl);
  };

  const { openCamera: openCameraForAttachment } = useCamera({ onCapture: handleCapture });
  const { isCameraOpen } = useCamera();

  const { isListening } = useVoiceRecognition();
  
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendMessage = async () => {
    if (!message && !attachment) return;
    setLoading(true);
    
    try {
      // For now, ignoring attachment in chat, but you could send it here
      const chatResponse = await assistantChat({ query: message });

      if (chatResponse.toolRequest && chatResponse.toolRequest.tool.name === 'navigateToPage') {
          const page = chatResponse.toolRequest.input.page;
          toast({
              title: 'Navigation',
              description: `Navigating to ${page}...`,
          });
          router.push(`/${page}`);
      } else {
         toast({
            title: 'Assistant',
            description: chatResponse.response,
          });
      }

    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get a response from the assistant.',
      });
      console.error('Assistant chat error:', error);
    } finally {
        setMessage('');
        setAttachment(null);
        setLoading(false);
    }
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
              onClick={openCameraForAttachment}
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
            disabled={loading}
          />

          <VoiceButton />

          <Button
            variant="ghost"
            size="icon"
            onClick={handleSendMessage}
            disabled={isListening || isCameraOpen || loading || (!message && !attachment)}
            className="h-8 w-8 flex-shrink-0 rounded-full bg-foreground text-primary transition-shadow hover:bg-foreground/90"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
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
