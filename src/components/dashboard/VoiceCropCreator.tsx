
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { cropsApi } from '@/lib/crops-api';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { extractCropData } from '@/ai/flows/crop-voice-assistant';
import { useLanguage } from '@/hooks/use-language';
import { TranslationKey } from '@/lib/translations';

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
  const { t, language } = useLanguage();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const questions: TranslationKey[] = [
    'voiceCreator.questions.crop_name',
    'voiceCreator.questions.crop_variety',
    'voiceCreator.questions.current_crop',
    'voiceCreator.questions.total_area',
    'voiceCreator.questions.cultivable_area',
    'voiceCreator.questions.soil_type',
    'voiceCreator.questions.water_source',
    'voiceCreator.questions.irrigation_type',
    'voiceCreator.questions.address',
    'voiceCreator.questions.village',
    'voiceCreator.questions.district',
    'voiceCreator.questions.state',
    'voiceCreator.questions.crop_stage',
    'voiceCreator.questions.planting_date',
    'voiceCreator.questions.harvest_date'
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
      const audioResponse = await textToSpeech({ text, language });
      
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
  }, [language]);

  const processVoiceInput = useCallback(async (input: string) => {
    setIsProcessing(true);
    
    try {
      const fieldType = fieldTypes[currentStep] as any;
      const questionText = t(questions[currentStep]);

      const response = await extractCropData({
        userInput: input,
        questionContext: questionText,
        fieldType: fieldType,
      });
      
      if (response.needsClarification) {
        const clarificationQuestion = response.clarificationQuestion || t('voiceCreator.errors.repeat');
        await speak(clarificationQuestion);
        setTranscript(`${t('voiceCreator.clarificationNeeded')}: ${input}`);
        setIsProcessing(false);
        return;
      }
      
      const extractedValue = response.extractedValue;
      
      const fieldName = fieldNames[currentStep];
      const newCropData = { ...cropData };
      
      if (fieldName === 'total_area_acres' || fieldName === 'cultivable_area_acres') {
        const numValue = parseFloat(extractedValue);
        if (!isNaN(numValue)) {
          newCropData[fieldName] = numValue;
        } else {
          await speak(t('voiceCreator.errors.areaNumber'));
          setIsProcessing(false);
          return;
        }
      } else if (fieldName === 'planting_date' || fieldName === 'expected_harvest_date') {
        if (extractedValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
          newCropData[fieldName] = extractedValue;
        } else {
          await speak(t('voiceCreator.errors.date_format'));
          setIsProcessing(false);
          return;
        }
      } else {
        newCropData[fieldName] = extractedValue;
      }
      
      setCropData(newCropData);
      setTranscript(`${t('voiceCreator.recorded')} ${extractedValue}`);
      
      await speak(`${t('voiceCreator.gotIt')} ${extractedValue}.`);
      
      if (currentStep < questions.length - 1) {
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
          speak(t(questions[currentStep + 1]));
        }, 1500);
      } else {
        await speak(t('voiceCreator.allInfoCollected'));
        setTimeout(() => createCrop(newCropData), 2000);
      }
      
    } catch (error) {
      console.error('Error processing voice input:', error);
      await speak(t('voiceCreator.errors.processing'));
    } finally {
      setIsProcessing(false);
    }
  }, [currentStep, cropData, speak, t, questions]);

  const startListening = useCallback(() => {
    if (!hasRecognitionSupport || isListening) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language === 'kn' ? 'kn-IN' : 'en-US';
    
    recognition.onstart = () => {
      setIsListening(true);
      setTranscript(t('voiceCreator.listening'));
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
          title: t('voiceCreator.errors.voiceErrorTitle'),
          description: t('voiceCreator.errors.voiceErrorDescription'),
          variant: 'destructive',
        });
      }
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognitionRef.current = recognition;
    recognition.start();
  }, [hasRecognitionSupport, isListening, processVoiceInput, toast, language, t]);

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
        title: t('voiceCreator.errors.authRequiredTitle'),
        description: t('voiceCreator.errors.authRequiredDescription'),
        variant: 'destructive',
      });
      return;
    }

    setIsCreating(true);
    try {
      const requiredFields = {
        crop_name: data.crop_name || 'Unknown',
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
      
      await speak(t('voiceCreator.successCreate'));
      
      toast({
        title: t('voiceCreator.successToastTitle'),
        description: t('voiceCreator.successToastDescription', { cropName: data.crop_name || 'Your crop' }),
      });
      
      setTimeout(() => {
        setCropData({});
        setCurrentStep(0);
        setTranscript('');
      }, 3000);
      
    } catch (error) {
      console.error('Failed to create crop:', error);
      await speak(t('voiceCreator.errors.createError'));
      toast({
        title: t('voiceCreator.errors.createErrorToastTitle'),
        description: t('voiceCreator.errors.createErrorToastDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const startVoiceFlow = async () => {
    if (!isAuthenticated) {
      toast({
        title: t('voiceCreator.errors.authRequiredTitle'),
        description: t('voiceCreator.errors.authRequiredDescription'),
        variant: 'destructive',
      });
      return;
    }

    setCropData({});
    setCurrentStep(0);
    setTranscript('');
    await speak(t(questions[0]));
  };

  if (!hasRecognitionSupport) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">{t('voiceCreator.errors.noSupport')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-foreground" />
          {t('voiceCreator.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentStep === 0 && !transcript ? (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">{t('voiceCreator.description')}</p>
            <Button onClick={startVoiceFlow} size="lg" className="w-full bg-foreground text-primary hover:bg-foreground/90">
              <Mic className="mr-2 h-4 w-4" />
              {t('voiceCreator.start')}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline">
                {t('voiceCreator.step', { current: currentStep + 1, total: questions.length })}
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
                      {t('voiceCreator.stop')}
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-4 w-4" />
                      {t('voiceCreator.listen')}
                    </>
                  )}
                </Button>
                {isSpeaking && (
                  <Button variant="outline" size="sm" disabled>
                    <Volume2 className="mr-2 h-4 w-4" />
                    {t('voiceCreator.speaking')}
                  </Button>
                )}
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">{t('voiceCreator.currentQuestion')}</p>
              <p className="text-sm">{t(questions[currentStep])}</p>
            </div>

            {transcript && (
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm font-medium mb-2">
                  {isListening ? t('voiceCreator.listening') : isProcessing ? t('voiceCreator.processing') : t('voiceCreator.recorded')}
                </p>
                <p className="text-sm">{transcript}</p>
              </div>
            )}

            {isCreating && (
              <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="text-sm">{t('voiceCreator.creating')}</span>
              </div>
            )}

            {Object.keys(cropData).length > 1 && ( // Show only if there's more than lat/long
              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm font-medium mb-2">{t('voiceCreator.collectedInfo')}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(cropData).map(([key, value]) => (
                     (key !== 'latitude' && key !== 'longitude') &&
                    <div key={key} className="flex justify-between">
                      <span className="font-medium">{t(`voiceCreator.fields.${key}` as TranslationKey) || key.replace('_', ' ')}:</span>
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

    