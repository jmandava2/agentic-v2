'use client';
import { useState, useEffect } from 'react';
import { analyzeMarketData } from '@/ai/flows/analyze-market-data';
import type { AnalyzeMarketDataOutput } from '@/ai/flows/analyze-market-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MarketChart } from '@/components/market-advisory/MarketChart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/hooks/use-language';

const mockAnalysisData = {
  produce: 'Sona Masoori Rice',
  currentMarketPrice: 2500,
  historicalMarketPrices: '[2200, 2300, 2250, 2400, 2450, 2500, 2480]',
};

const generateChartData = (timeRange: string) => {
    switch (timeRange) {
        case 'weekly':
            return [
                { label: 'Week 1', price: 2250 },
                { label: 'Week 2', price: 2350 },
                { label: 'Week 3', price: 2400 },
                { label: 'Week 4', price: 2480 },
            ];
        case 'monthly':
            return [
                { label: 'Jan', price: 2100 },
                { label: 'Feb', price: 2150 },
                { label: 'Mar', price: 2200 },
                { label: 'Apr', price: 2250 },
                { label: 'May', price: 2300 },
                { label: 'Jun', price: 2400 },
                { label: 'Jul', price: 2480 },
            ]
        case 'daily':
        default:
            return JSON.parse(mockAnalysisData.historicalMarketPrices).map((price: number, index: number) => ({ label: `Day ${index + 1}`, price }));
    }
}


export default function MarketAdvisoryPage() {
  const [result, setResult] = useState<AnalyzeMarketDataOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('daily');
  const [chartData, setChartData] = useState(generateChartData(timeRange));
  const { t, language } = useLanguage();

  useEffect(() => {
    setChartData(generateChartData(timeRange));
  }, [timeRange]);

  useEffect(() => {
    const getAnalysis = async () => {
      setLoading(true);
      try {
        const analysisResult = await analyzeMarketData({
          produce: mockAnalysisData.produce,
          currentMarketPrice: mockAnalysisData.currentMarketPrice,
          historicalMarketPrices: mockAnalysisData.historicalMarketPrices,
          language: language,
        });
        setResult(analysisResult);
      } catch (error) {
        console.error('Market analysis error:', error);
        toast({
          variant: 'destructive',
          title: t('market.toast.fail.title'),
          description: t('market.toast.fail.description'),
        });
      } finally {
        setLoading(false);
      }
    };
    getAnalysis();
  }, [toast, t, language]);


  return (
    <>
    <h1 className="font-headline text-3xl font-bold mb-6">{t('market.title')}</h1>
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      
      <div className="lg:col-span-3">
        <Card className="h-full">
           <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="font-headline">{t('market.chart.title')}</CardTitle>
                <CardDescription>{t('market.chart.description', { produce: t('crops.sonaMasooriRice') })}</CardDescription>
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">{t('market.chart.daily')}</SelectItem>
                  <SelectItem value="weekly">{t('market.chart.weekly')}</SelectItem>
                  <SelectItem value="monthly">{t('market.chart.monthly')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <MarketChart data={chartData} />
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-4">
        {loading && (
          <Card className="h-48 flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </Card>
        )}
        {!loading && result && (
            <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="font-headline">{t('market.recommendation.title')}</CardTitle>
                     <Badge
                          variant={result.recommendation === 'Sell' ? 'default' : 'secondary'}
                          className={`px-4 py-2 text-base ${result.recommendation === 'Sell' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-yellow-500 hover:bg-yellow-600 text-white'}`}
                        >
                          {t(`market.recommendation.${result.recommendation.toLowerCase()}`)}
                        </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                    <Separator className="my-2" />
                    <div>
                        <h4 className="font-headline text-lg mb-2">{t('market.recommendation.reason')}</h4>
                        <p className="text-muted-foreground">{result.rationale}</p>
                    </div>
                </CardContent>
            </Card>
        )}
         {!loading && !result && (
            <Card>
                <CardContent className="h-48 flex items-center justify-center">
                    <p className="text-muted-foreground">{t('market.recommendation.fail')}</p>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
    </>
  );
}
