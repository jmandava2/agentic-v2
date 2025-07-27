
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/hooks/use-language';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { cropsApi, type Crop } from '@/lib/crops-api';
import { diseaseApi, type DiseaseAnalysisResponse, type TreatmentOption, type PreventionStrategy } from '@/lib/disease-api';
import { LoginDialog } from '@/components/auth/LoginDialog';
import Image from 'next/image';
import { 
  Leaf, 
  MapPin, 
  Stethoscope, 
  Upload, 
  Camera, 
  Loader2, 
  AlertTriangle, 
  CheckCircle, 
  TrendingDown, 
  DollarSign,
  Clock,
  Target,
  ExternalLink
} from 'lucide-react';

interface FormData {
  cropType: string;
  symptomsText: string;
  location: string;
  cropId: string;
  createLogs: boolean;
  imageFile: File | null;
}

function TreatmentCard({ treatment }: { treatment: TreatmentOption }) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'chemical': return 'bg-red-100 text-red-800';
      case 'biological': return 'bg-green-100 text-green-800';
      case 'cultural': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{treatment.treatment_name}</CardTitle>
          <Badge className={getTypeColor(treatment.treatment_type)}>
            {treatment.treatment_type}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Effectiveness:</span>
          <Progress value={treatment.effectiveness * 100} className="flex-1" />
          <span className="text-sm font-medium">{Math.round(treatment.effectiveness * 100)}%</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold mb-2">Application:</h4>
          <p className="text-sm text-muted-foreground">{treatment.application_method}</p>
          <p className="text-sm"><strong>Dosage:</strong> {treatment.dosage}</p>
          <p className="text-sm"><strong>Frequency:</strong> {treatment.frequency}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold mb-2">Cost & Availability:</h4>
          <p className="text-sm text-green-600 font-medium">{treatment.cost_estimate}</p>
          <p className="text-xs text-muted-foreground">{treatment.availability}</p>
        </div>

        {treatment.side_effects.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Side Effects:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              {treatment.side_effects.map((effect, index) => (
                <li key={index}>• {effect}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PreventionCard({ strategy }: { strategy: PreventionStrategy }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">{strategy.strategy_name}</CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Effectiveness:</span>
          <Progress value={strategy.effectiveness * 100} className="flex-1" />
          <span className="text-sm font-medium">{Math.round(strategy.effectiveness * 100)}%</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{strategy.description}</p>
        
        <div>
          <h4 className="text-sm font-semibold mb-2">Implementation Steps:</h4>
          <ul className="text-sm space-y-1">
            {strategy.implementation_steps.map((step, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary font-medium">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold">Timing:</h4>
            <p className="text-muted-foreground">{strategy.timing}</p>
          </div>
          <div>
            <h4 className="font-semibold">Cost:</h4>
            <p className="text-green-600 font-medium">{strategy.cost}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


export default function HealthPage() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FormData>({
    cropType: '',
    symptomsText: '',
    location: '',
    cropId: '',
    createLogs: true,
    imageFile: null,
  });
  
  const [crops, setCrops] = useState<Crop[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DiseaseAnalysisResponse | null>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCrops();
      getCurrentLocation();
    }
  }, [isAuthenticated]);

  const fetchCrops = async () => {
    try {
      const cropsData = await cropsApi.getCrops();
      setCrops(cropsData);
    } catch (error) {
      console.error('Failed to fetch crops:', error);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // For demo, using a default location
          setFormData(prev => ({ ...prev, location: 'Bangalore, Karnataka' }));
        },
        () => {
          setFormData(prev => ({ ...prev, location: 'Bangalore, Karnataka' }));
        }
      );
    }
  };

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select an image smaller than 10MB.',
          variant: 'destructive',
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file.',
          variant: 'destructive',
        });
        return;
      }

      setFormData(prev => ({ ...prev, imageFile: file }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [toast]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      const fakeEvent = {
        target: { files: [file] }
      } as React.ChangeEvent<HTMLInputElement>;
      handleImageUpload(fakeEvent);
    }
  }, [handleImageUpload]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }

    // Validation
    if (!formData.imageFile) {
      toast({
        title: 'Image Required',
        description: 'Please upload an image of your crop.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.cropType || !formData.symptomsText || !formData.location || !formData.cropId) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await diseaseApi.analyzeDisease({
        crop_type: formData.cropType,
        symptoms_text: formData.symptomsText,
        location: formData.location,
        crop_id: formData.cropId,
        create_logs_and_todos: formData.createLogs,
        image: formData.imageFile,
      });

      setAnalysisResult(result);
      toast({
        title: 'Analysis Complete',
        description: 'Your crop health analysis is ready.',
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      cropType: '',
      symptomsText: '',
      location: '',
      cropId: '',
      createLogs: true,
      imageFile: null,
    });
    setImagePreview(null);
    setAnalysisResult(null);
  };

  if (analysisResult) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold">Crop Health Analysis Report</h1>
          <Button onClick={resetForm} variant="outline">
            <Camera className="mr-2 h-4 w-4" />
            Analyze Another Crop
          </Button>
        </div>

        {/* Disease Identification */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{analysisResult.report.disease_identification.disease_name}</CardTitle>
                <CardDescription className="text-lg italic">
                  {analysisResult.report.disease_identification.scientific_name}
                </CardDescription>
              </div>
              <div className="text-right">
                <Badge variant={analysisResult.report.disease_identification.confidence === 'high' ? 'default' : 'secondary'}>
                  {analysisResult.report.disease_identification.confidence} confidence
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  {Math.round(analysisResult.report.disease_identification.confidence_score * 100)}% accuracy
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Symptoms Observed:</h4>
                <ul className="text-sm space-y-1">
                  {analysisResult.report.disease_identification.symptoms_observed.map((symptom, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <AlertTriangle className="h-3 w-3 text-orange-500" />
                      {symptom}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Affected Parts:</h4>
                <ul className="text-sm space-y-1">
                  {analysisResult.report.disease_identification.affected_plant_parts.map((part, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Leaf className="h-3 w-3 text-green-500" />
                      {part}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Severity Level:</h4>
                <Badge variant={analysisResult.report.disease_identification.severity === 'high' ? 'destructive' : 'secondary'}>
                  {analysisResult.report.disease_identification.severity}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Economic Impact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Economic Impact Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <DollarSign className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-600">
                  {analysisResult.report.yield_impact.potential_yield_loss}%
                </p>
                <p className="text-sm text-muted-foreground">Potential Yield Loss</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-lg font-bold text-blue-600">
                  {analysisResult.report.yield_impact.recovery_timeline}
                </p>
                <p className="text-sm text-muted-foreground">Recovery Time</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(analysisResult.report.yield_impact.mitigation_potential * 100)}%
                </p>
                <p className="text-sm text-muted-foreground">Mitigation Potential</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <p className="text-lg font-bold text-orange-600">Moderate</p>
                <p className="text-sm text-muted-foreground">Market Impact</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm">{analysisResult.report.yield_impact.economic_impact}</p>
            </div>
          </CardContent>
        </Card>

        {/* Treatment and Prevention */}
        <Tabs defaultValue="treatments" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="treatments">Treatment Options</TabsTrigger>
            <TabsTrigger value="prevention">Prevention Strategies</TabsTrigger>
            <TabsTrigger value="actions">Action Plan</TabsTrigger>
          </TabsList>
          
          <TabsContent value="treatments" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analysisResult.report.treatment_options.map((treatment, index) => (
                <TreatmentCard key={index} treatment={treatment} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="prevention" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysisResult.report.prevention_strategies.map((strategy, index) => (
                <PreventionCard key={index} strategy={strategy} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="actions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Immediate Actions Required</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisResult.report.immediate_actions.map((action, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-600">Long-term Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisResult.report.long_term_recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Executive Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Executive Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{analysisResult.report.executive_summary}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
      
      <div className="space-y-8">
        <h1 className="font-headline text-3xl font-bold">Crop Health Check</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Crop Image</CardTitle>
                <CardDescription>Take a clear photo of the affected crop area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {imagePreview ? (
                    <div className="relative">
                      <Image
                        src={imagePreview}
                        alt="Crop preview"
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData(prev => ({ ...prev, imageFile: null }));
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                    >
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Drag and drop an image here, or click to select
                      </p>
                      <input
                        type="file"
                        accept="image/*,image/jpeg,image/png,image/jpg"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" asChild>
                          <span>
                            <Camera className="mr-2 h-4 w-4" />
                            Select Image
                          </span>
                        </Button>
                      </label>
                      <p className="text-xs text-muted-foreground mt-2">
                        Supports JPEG, PNG (max 10MB)
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Form Fields */}
            <Card>
              <CardHeader>
                <CardTitle>Crop Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="crop-type">Crop Type *</Label>
                    <Select value={formData.cropType} onValueChange={(value) => setFormData(prev => ({ ...prev, cropType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Wheat/Grain">Wheat/Grain</SelectItem>
                        <SelectItem value="Rice">Rice</SelectItem>
                        <SelectItem value="Cotton">Cotton</SelectItem>
                        <SelectItem value="Tomato">Tomato</SelectItem>
                        <SelectItem value="Potato">Potato</SelectItem>
                        <SelectItem value="Sugarcane">Sugarcane</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="crop-id">Your Crop *</Label>
                    <Select value={formData.cropId} onValueChange={(value) => setFormData(prev => ({ ...prev, cropId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your crop" />
                      </SelectTrigger>
                      <SelectContent>
                        {crops.map((crop) => (
                          <SelectItem key={crop.id} value={crop.id.toString()}>
                            {crop.crop_name} - {crop.crop_variety}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter your location"
                  />
                </div>

                <div>
                  <Label htmlFor="symptoms">Symptoms Description *</Label>
                  <Textarea
                    id="symptoms"
                    value={formData.symptomsText}
                    onChange={(e) => setFormData(prev => ({ ...prev, symptomsText: e.target.value }))}
                    placeholder="Describe what you observe: leaf color changes, spots, wilting, etc."
                    rows={4}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                  <Label htmlFor="create-logs" className="font-semibold">
                    Create logs and action items
                  </Label>
                  <Switch
                    id="create-logs"
                    checked={formData.createLogs}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, createLogs: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Submit */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analysis</CardTitle>
                <CardDescription>
                  Our AI will analyze your crop image and symptoms to provide detailed health insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isSubmitting || !isAuthenticated}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Crop Health...
                    </>
                  ) : (
                    <>
                      <Stethoscope className="mr-2 h-4 w-4" />
                      Analyze Crop Health
                    </>
                  )}
                </Button>
                
                {!isAuthenticated && (
                  <p className="text-sm text-muted-foreground text-center">
                    Please sign in to analyze your crops
                  </p>
                )}
              </CardContent>
            </Card>

            {/* What to Expect */}
            <Card>
              <CardHeader>
                <CardTitle>What You'll Get</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Disease identification with confidence score
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Treatment recommendations with costs
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Prevention strategies for future
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Economic impact assessment
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Immediate action plan
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </>
  );
}
