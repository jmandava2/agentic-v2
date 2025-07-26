
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { RefreshCw } from 'lucide-react';

export function CameraPane() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(true);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceId, setCurrentDeviceId] = useState<string | undefined>(
    undefined
  );
  const { toast } = useToast();

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

      // Stop any existing stream
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

        // After getting permission, enumerate devices to populate the list
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter(
          (d) => d.kind === 'videoinput'
        );
        setDevices(videoDevices);
        
        // Set the current device ID
        const currentTrack = stream.getVideoTracks()[0];
        const currentSettings = currentTrack.getSettings();
        setCurrentDeviceId(currentSettings.deviceId);


      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        // Fallback to any camera if environment fails
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
      // Cleanup: stop video stream when component unmounts
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


  return (
    <div className="w-full max-w-md h-full flex flex-col items-center justify-center p-4">
      <div className="w-full aspect-[9/16] rounded-2xl border-2 border-dashed bg-secondary/50 flex items-center justify-center overflow-hidden mb-4">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
        />
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
        devices.length > 1 && (
            <Button onClick={handleSwitchCamera} variant="outline" className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Switch Camera
            </Button>
        )
      )}
    </div>
  );
}
