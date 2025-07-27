
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { RefreshCw, Camera as CameraIcon } from 'lucide-react';
import { useCamera } from '@/hooks/use-camera';

export function CameraPane() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(true);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceId, setCurrentDeviceId] = useState<string | undefined>(
    undefined
  );
  const { toast } = useToast();
  const { closeCamera, onCapture } = useCamera();

  const getCameraPermission = useCallback(
    async (deviceId?: string) => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description:
            'Your browser does not support camera access. Please try a different browser.',
        });
        setHasCameraPermission(false);
        return;
      }

      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }

      try {
        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: deviceId ? undefined : { exact: 'environment' },
            deviceId: deviceId ? { exact: deviceId } : undefined,
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter(
          (d) => d.kind === 'videoinput'
        );
        setDevices(videoDevices);
        
        const currentTrack = stream.getVideoTracks()[0];
        const currentSettings = currentTrack.getSettings();
        setCurrentDeviceId(currentSettings.deviceId);


      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        if ((error as Error).name === 'OverconstrainedError' || (error as Error).name === "NotFoundError") {
             try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setHasCameraPermission(true);
                 if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
             } catch (fallbackError) {
                 toast({
                    variant: 'destructive',
                    title: 'Camera Access Denied',
                    description:
                    'Could not access any camera. Please enable permissions in your browser settings.',
                });
             }
        } else {
             toast({
                variant: 'destructive',
                title: 'Camera Access Denied',
                description:
                'Please enable camera permissions in your browser settings.',
            });
        }
      }
    },
    [toast]
  );

  useEffect(() => {
    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSwitchCamera = () => {
    if (devices.length > 1) {
      const currentDeviceIndex = devices.findIndex(
        (d) => d.deviceId === currentDeviceId
      );
      const nextDeviceIndex = (currentDeviceIndex + 1) % devices.length;
      const nextDeviceId = devices[nextDeviceIndex].deviceId;
      getCameraPermission(nextDeviceId);
    }
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onCapture?.(dataUrl);
        closeCamera();
      }
    }
  };


  return (
    <div className="w-full max-w-md h-full flex flex-col items-center justify-center p-4">
      <div className="w-full aspect-[9/16] rounded-2xl border-2 border-dashed bg-secondary/50 flex items-center justify-center overflow-hidden mb-4 relative">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
      {!hasCameraPermission ? (
        <div className="w-full">
          <Alert variant="destructive">
            <AlertTitle>Camera Access Required</AlertTitle>
            <AlertDescription>
              Please allow camera access to use this feature. You may need to
              reload the page after granting permission.
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <div className="w-full flex items-center justify-center gap-2">
            <Button onClick={handleCapture} className="w-full" size="lg">
                <CameraIcon className="mr-2 h-5 w-5" />
                Capture
            </Button>
            {devices.length > 1 && (
                <Button onClick={handleSwitchCamera} variant="outline" size="icon">
                    <RefreshCw className="h-5 w-5" />
                    <span className="sr-only">Switch Camera</span>
                </Button>
            )}
        </div>
      )}
    </div>
  );
}
