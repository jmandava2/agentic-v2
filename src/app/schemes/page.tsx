'use client';

import { useState, useEffect } from 'react';
import { SchemeCard } from '@/components/schemes/SchemeCard';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { schemesApi, type Scheme } from '@/lib/schemes-api';
import { cropsApi } from '@/lib/crops-api';
import { LoginDialog } from '@/components/auth/LoginDialog';
import { RefreshCw, Search, ExternalLink } from 'lucide-react';
import { TranslationKey } from '@/lib/translations';

type Scheme = {
  titleKey: TranslationKey;
  crop: 'Sona Masoori Rice' | 'Sugarcane';
  descriptionKey: TranslationKey;
  eligibilityKey: TranslationKey;
  benefitsKey: TranslationKey;
  howToApplyKey: TranslationKey;
  link: string;
};

const allSchemes: Scheme[] = [
  {
    titleKey: 'schemes.list.pmfby.title',
    crop: 'Sona Masoori Rice',
    descriptionKey: 'schemes.list.pmfby.description',
    eligibilityKey: 'schemes.list.pmfby.eligibility',
    benefitsKey: 'schemes.list.pmfby.benefits',
    howToApplyKey: 'schemes.list.pmfby.howToApply',
    link: '#',
  },
  {
    titleKey: 'schemes.list.soilHealthCard.title',
    crop: 'Sona Masoori Rice',
    descriptionKey: 'schemes.list.soilHealthCard.description',
    eligibilityKey: 'schemes.list.soilHealthCard.eligibility',
    benefitsKey: 'schemes.list.soilHealthCard.benefits',
    howToApplyKey: 'schemes.list.soilHealthCard.howToApply',
    link: '#',
  },
  {
    titleKey: 'schemes.list.nfsm.title',
    crop: 'Sona Masoori Rice',
    descriptionKey: 'schemes.list.nfsm.description',
    eligibilityKey: 'schemes.list.nfsm.eligibility',
    benefitsKey: 'schemes.list.nfsm.benefits',
    howToApplyKey: 'schemes.list.nfsm.howToApply',
    link: '#',
  },
  {
    titleKey: 'schemes.list.kcc.title',
    crop: 'Sugarcane',
    descriptionKey: 'schemes.list.kcc.description',
    eligibilityKey: 'schemes.list.kcc.eligibility',
    benefitsKey: 'schemes.list.kcc.benefits',
    howToApplyKey: 'schemes.list.kcc.howToApply',
    link: '#',
  },
  {
    titleKey: 'schemes.list.pkvy.title',
    crop: 'Sugarcane',
    descriptionKey: 'schemes.list.pkvy.description',
    eligibilityKey: 'schemes.list.pkvy.eligibility',
    benefitsKey: 'schemes.list.pkvy.benefits',
    howToApplyKey: 'schemes.list.pkvy.howToApply',
    link: '#',
  },
];


function RecommendedSchemeCard({ scheme }: { scheme: Scheme }) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg leading-tight">{scheme.title}</CardTitle>
          <span className={`text-xs px-2 py-1 rounded-full ${
            scheme.state_or_central === 'Central' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {scheme.state_or_central}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{scheme.department}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm line-clamp-3">{scheme.description}</p>
        
        <div className="space-y-2">
          <div>
            <h4 className="text-sm font-semibold">Eligibility:</h4>
            <p className="text-xs text-muted-foreground line-clamp-2">{scheme.eligibility}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold">Benefits:</h4>
            <p className="text-xs text-muted-foreground line-clamp-2">{scheme.benefits}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold">Target:</h4>
            <p className="text-xs text-muted-foreground line-clamp-1">{scheme.target_beneficiaries}</p>
          </div>
        </div>
        
        {scheme.scheme_link && scheme.scheme_link !== 'null' && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => window.open(scheme.scheme_link, '_blank')}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Learn More
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function SchemesPage() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [recommendedSchemes, setRecommendedSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [farmerCrops, setFarmerCrops] = useState<any[]>([]);

  const recommendedSchemes_static = allSchemes.filter(
    (scheme) => scheme.crop === 'Sona Masoori Rice'
  );
  const otherSchemes = allSchemes.filter(
    (scheme) => scheme.crop !== 'Sona Masoori Rice'
  );

  const fetchRecommendedSchemes = async () => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }

    setLoading(true);
    try {
      // First get farmer's crops
      const crops = await cropsApi.getCrops();
      setFarmerCrops(crops);
      
      // Then get recommended schemes based on crops
      const schemesResponse = await schemesApi.getRecommendedSchemes(crops);
      setRecommendedSchemes(schemesResponse.schemes);
      
      toast({
        title: 'Schemes Updated',
        description: `Found ${schemesResponse.total_schemes} relevant schemes for your crops.`,
      });
    } catch (error) {
      console.error('Failed to fetch schemes:', error);
      if (error instanceof Error && error.message.includes('Authentication required')) {
        setShowLoginDialog(true);
      } else {
        toast({
          title: 'Failed to Load Schemes',
          description: 'Please try again later.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecommendedSchemes();
    }
  }, [isAuthenticated]);

  return (
    <>
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-headline text-3xl font-bold">
          {t('schemes.title')}
        </h1>
        
        {isAuthenticated && (
          <Button
            variant="outline"
            onClick={fetchRecommendedSchemes}
            disabled={loading}
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Get Recommendations
              </>
            )}
          </Button>
        )}
      </div>
      
      {/* Personalized Recommendations */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline text-2xl font-semibold">
            {isAuthenticated ? 'Recommended for Your Crops' : t('schemes.recommended')}
          </h2>
          {farmerCrops.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Based on: {farmerCrops.map(c => c.crop_name).join(', ')}
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recommendedSchemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedSchemes.map((scheme, index) => (
              <RecommendedSchemeCard key={index} scheme={scheme} />
            ))}
          </div>
        ) : isAuthenticated ? (
          <Card className="border-dashed">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">
                No personalized schemes found. Add crops to get better recommendations.
              </p>
              <Button onClick={fetchRecommendedSchemes} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedSchemes_static.map((scheme, index) => (
              <SchemeCard key={index} {...scheme} />
            ))}
          </div>
        )}
      </div>

      <Separator className="my-8" />

      {/* Other Schemes */}
      <div>
        <h2 className="font-headline text-2xl font-semibold mb-4">{t('schemes.other')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherSchemes.map((scheme, index) => (
            <SchemeCard key={index} {...scheme} />
          ))}
        </div>
      </div>
    </>
  );
}
