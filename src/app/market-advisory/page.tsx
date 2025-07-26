
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

const mockAnalysisData = {
  produce: 'Sona Masoori Rice',
  currentMarketPrice: 2500,
  historicalMarketPrices: '[2200, 2300, 2250, 2400, 2450, 2500, 2480]',
};

const mockChartData = JSON.parse(mockAnalysisData.historicalMarketPrices).map((price: number, index: number) => ({ day: `Day ${index + 1}`, price }));


export default function MarketAdvisoryPage() {
  const [result, setResult] = useState<AnalyzeMarketDataOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('daily');

  useEffect(() => {
    const getAnalysis = async () => {
      setLoading(true);
      try {
        const analysisResult = await analyzeMarketData({
          produce: mockAnalysisData.produce,
          currentMarketPrice: mockAnalysisData.currentMarketPrice,
          historicalMarketPrices: mockAnalysisData.historicalMarketPrices
        });
        setResult(analysisResult);
      } catch (error) {
        console.error('Market analysis error:', error);
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: 'Could not retrieve market analysis.',
        });
      } finally {
        setLoading(false);
      }
    };
    getAnalysis();
  }, [toast]);


  return (
    <>
    <h1 className="font-headline text-3xl font-bold mb-6">Market Advisory</h1>
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      
      <div className="lg:col-span-3">
        <Card className="h-full">
           <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="font-headline">Price Trend</CardTitle>
                <CardDescription>Historical price data for {mockAnalysisData.produce}.</CardDescription>
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <MarketChart data={mockChartData} />
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
            <>
                <Card>
                    <CardContent className="p-4 flex justify-between items-center">
                        <p className="font-medium text-muted-foreground">Recommendation</p>
                        <Badge
                          variant={result.recommendation === 'Sell' ? 'default' : 'secondary'}
                          className={`px-4 py-2 text-base ${result.recommendation === 'Sell' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-yellow-500 hover:bg-yellow-600 text-white'}`}
                        >
                          {result.recommendation}
                        </Badge>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-lg">Reason</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{result.rationale}</p>
                    </CardContent>
                </Card>
            </>
        )}
         {!loading && !result && (
            <Card>
                <CardContent className="h-48 flex items-center justify-center">
                    <p className="text-muted-foreground">Could not load recommendation.</p>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
    </>
  );
}
