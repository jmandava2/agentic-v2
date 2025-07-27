
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { cropsApi } from '@/lib/crops-api';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { extractCropData } from '@/ai/flows/crop-voice-assistant';
import { cn } from '@/lib/utils';

interface VoiceCropData {
  crop_name?: string;
  crop_variety?: string;
  current_crop?: string;
  total_area_acres?: number;
  cultivable_area_acres?: number;
  soil_type?: string;
  water_source?: string;
  irrigation_type?: string;
  address?: string;
  village?: string;
  district?: string;
  state?: string;
  crop_stage?: string;
  planting_date?: string;
  expected_harvest_date?: string;
  latitude?: number;
  longitude?: number;
}

export function VoiceCropCreator() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [cropData, setCropData] = useState<VoiceCropData>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [hasRecognitionSupport, setHasRecognitionSupport] = useState(false);
  
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const questions = [
    "What crop would you like to add? For example, say 'Rice' or 'Wheat'.",
    "What variety of this crop? For example, 'Basmati' or 'Sona Masoori'.",
    "What is the current crop growing there? This could be the same or different.",
    "How many total acres is your farm?",
    "How many acres are cultivable?",
    "What type of soil do you have? Options include clay, loam, sandy, or black soil.",
    "What is your water source? Ground water, river water, or rain water?",
    "What irrigation type do you use? Drip system, sprinkler, or flood irrigation?",
    "What is your address or location?",
    "Which village is your farm in?",
    "Which district?",
    "Which state?",
    "What stage is your crop in? Seedling, vegetative, flowering, or maturity?",
    "When did you plant this crop? Please say the date.",
    "When do you expect to harvest? Please say the expected date."
  ];

  const fieldNames: (keyof VoiceCropData)[] = [
    'crop_name', 'crop_variety', 'current_crop', 'total_area_acres', 'cultivable_area_acres',
    'soil_type', 'water_source', 'irrigation_type', 'address', 'village', 'district', 'state',
    'crop_stage', 'planting_date', 'expected_harvest_date'
  ];

  const fieldTypes = [
    'crop_name', 'crop_variety', 'current_crop', 'area', 'area',
    'soil_type', 'water_source', 'irrigation_type', 'location', 'location', 'location', 'location',
    'crop_stage', 'date', 'date'
  ];

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setHasRecognitionSupport(!!SpeechRecognition);
    
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
    }

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCropData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        (error) => console.log('Location error:', error)
      );
    }
  }, []);

  const speak = useCallback(async (text: string) => {
    try {
      setIsSpeaking(true);
      const audioResponse = await textToSpeech({ text, language: 'en' });
      
      if (audioResponse.media && audioRef.current) {
        audioRef.current.src = audioResponse.media;
        audioRef.current.onended = () => setIsSpeaking(false);
        await audioRef.current.play();
      } else {
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
    }
  }, []);

  const processVoiceInput = useCallback(async (input: string) => {
    setIsProcessing(true);
    
    try {
      // Use enhanced AI to extract and format the data
      const fieldType = fieldTypes[currentStep] as any;
      const response = await extractCropData({
        userInput: input,
        questionContext: questions[currentStep],
        fieldType: fieldType,
      });
      
      if (response.needsClarification) {
        await speak(response.clarificationQuestion || "Could you please repeat that?");
        setTranscript(`Need clarification: ${input}`);
        setIsProcessing(false);
        return;
      }
      
      const extractedValue = response.extractedValue;
      
      // Update crop data based on current step
      const fieldName = fieldNames[currentStep];
      const newCropData = { ...cropData };
      
      if (fieldName === 'total_area_acres' || fieldName === 'cultivable_area_acres') {
        const numValue = parseFloat(extractedValue);
        if (!isNaN(numValue)) {
          newCropData[fieldName] = numValue;
        } else {
          await speak("I need a number for the area. Please say how many acres, like 'five acres'.");
          setIsProcessing(false);
          return;
        }
      } else if (fieldName === 'planting_date' || fieldName === 'expected_harvest_date') {
        // Validate date format
        if (extractedValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
          newCropData[fieldName] = extractedValue;
        } else {
          await speak("Please provide the date in a clear format, like 'July 15th 2024'.");
          setIsProcessing(false);
          return;
        }
      } else {
        newCropData[fieldName] = extractedValue;
      }
      
      setCropData(newCropData);
      setTranscript(`✓ Recorded: ${extractedValue}`);
      
      // Confirm and move to next step
      await speak(`Got it, ${extractedValue}.`);
      
      if (currentStep < questions.length - 1) {
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
          speak(questions[currentStep + 1]);
        }, 1500);
      } else {
        await speak("Perfect! I have all the information. Let me create your crop record now.");
        setTimeout(() => createCrop(newCropData), 2000);
      }
      
    } catch (error) {
      console.error('Error processing voice input:', error);
      await speak("Sorry, I had trouble processing that. Could you please try again?");
    } finally {
      setIsProcessing(false);
    }
  }, [currentStep, cropData, speak]);

  const startListening = useCallback(() => {
    if (!hasRecognitionSupport || isListening) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('Listening...');
    };
    
    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          setTranscript(event.results[i][0].transcript);
        }
      }
      
      if (finalTranscript) {
        setTranscript(finalTranscript);
        processVoiceInput(finalTranscript);
      }
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error !== 'aborted') {
        toast({
          title: 'Voice Error',
          description: 'Could not recognize speech. Please try again.',
          variant: 'destructive',
        });
      }
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognitionRef.current = recognition;
    recognition.start();
  }, [hasRecognitionSupport, isListening, processVoiceInput, toast]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const createCrop = async (data: VoiceCropData) => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to create crops.',
        variant: 'destructive',
      });
      return;
    }

    setIsCreating(true);
    try {
      // Validate required fields
      const requiredFields = {
        crop_name: data.crop_name,
        latitude: data.latitude || 12.5677,
        longitude: data.longitude || 77.12367,
        address: data.address || 'Unknown',
        village: data.village || 'Unknown',
        district: data.district || 'Unknown',
        state: data.state || 'Unknown',
        total_area_acres: data.total_area_acres || 1,
        cultivable_area_acres: data.cultivable_area_acres || data.total_area_acres || 1,
        soil_type: data.soil_type || 'clay',
        water_source: data.water_source || 'ground water',
        irrigation_type: data.irrigation_type || 'drip system',
        current_crop: data.current_crop || data.crop_name || 'Unknown',
        crop_variety: data.crop_variety || 'Standard',
        planting_date: data.planting_date || new Date().toISOString().split('T')[0],
        expected_harvest_date: data.expected_harvest_date || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        crop_stage: data.crop_stage || 'seedling',
      };

      await cropsApi.createCrop(requiredFields);
      
      await speak("Perfect! Your crop has been successfully created and added to your farm.");
      
      toast({
        title: 'Crop Created Successfully',
        description: `${data.crop_name} has been added to your farm.`,
      });
      
      // Reset for next crop
      setTimeout(() => {
        setCropData({});
        setCurrentStep(0);
        setTranscript('');
      }, 3000);
      
    } catch (error) {
      console.error('Failed to create crop:', error);
      await speak("Sorry, there was an error creating your crop. Please try again.");
      toast({
        title: 'Failed to Create Crop',
        description: 'Please try again or use the manual form.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const startVoiceFlow = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to use voice crop creation.',
        variant: 'destructive',
      });
      return;
    }

    setCropData({});
    setCurrentStep(0);
    setTranscript('');
    await speak(questions[0]);
  };

  if (!hasRecognitionSupport) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Voice recognition not supported in this browser.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-primary" />
          Voice Crop Creator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentStep === 0 && !transcript ? (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Create crops using voice commands. I'll guide you through each step.
            </p>
            <Button onClick={startVoiceFlow} size="lg" className="w-full bg-foreground text-primary hover:bg-foreground/90">
              <Mic className="mr-2 h-4 w-4" />
              Start Voice Creation
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline">
                Step {currentStep + 1} of {questions.length}
              </Badge>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isListening ? stopListening : startListening}
                  disabled={isProcessing || isSpeaking || isCreating}
                >
                  {isListening ? (
                    <>
                      <MicOff className="mr-2 h-4 w-4" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-4 w-4" />
                      Listen
                    </>
                  )}
                </Button>
                {isSpeaking && (
                  <Button variant="outline" size="sm" disabled>
                    <Volume2 className="mr-2 h-4 w-4" />
                    Speaking
                  </Button>
                )}
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Current Question:</p>
              <p className="text-sm">{questions[currentStep]}</p>
            </div>

            {transcript && (
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm font-medium mb-2">
                  {isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Recorded:'}
                </p>
                <p className="text-sm">{transcript}</p>
              </div>
            )}

            {isCreating && (
              <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="text-sm">Creating your crop...</span>
              </div>
            )}

            {Object.keys(cropData).length > 0 && (
              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm font-medium mb-2">Collected Information:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(cropData).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium">{key.replace('_', ' ')}:</span>
                      <span>{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
