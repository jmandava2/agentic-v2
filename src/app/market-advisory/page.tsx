
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { analyzeMarketData } from '@/ai/flows/analyze-market-data';
import type { AnalyzeMarketDataOutput } from '@/ai/flows/analyze-market-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MarketChart } from '@/components/market-advisory/MarketChart';

const formSchema = z.object({
  produce: z.string().min(2, { message: 'Produce name is required.' }),
  currentMarketPrice: z.coerce.number().positive({ message: 'Price must be positive.' }),
  historicalMarketPrices: z.string().min(1, { message: 'Please provide historical prices.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function MarketAdvisoryPage() {
  const [result, setResult] = useState<AnalyzeMarketDataOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      produce: 'Sona Masoori Rice',
      currentMarketPrice: 2500,
      historicalMarketPrices: '[2200, 2300, 2250, 2400, 2450]',
    },
  });
  
  const historicalPricesArray = JSON.parse(form.watch('historicalMarketPrices') || '[]');
  const chartData = historicalPricesArray.map((price: number, index: number) => ({ day: `Day ${index + 1}`, price }));


  async function onSubmit(values: FormData) {
    setLoading(true);
    setResult(null);
    try {
      const parsedHistoricalPrices = JSON.parse(values.historicalMarketPrices);
      if (!Array.isArray(parsedHistoricalPrices)) {
        throw new Error('Historical prices must be a JSON array.');
      }

      const analysisResult = await analyzeMarketData({
        ...values,
        historicalMarketPrices: JSON.stringify(parsedHistoricalPrices),
      });
      setResult(analysisResult);
    } catch (error) {
      console.error('Market analysis error:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not analyze market data. Please check your inputs.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <h1 className="font-headline text-3xl font-bold mb-6">Market Advisory</h1>
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Market Analysis</CardTitle>
            <CardDescription>Get AI-powered sell or hold recommendations.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="produce"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Produce</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Wheat" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currentMarketPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Price (per quintal)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="2500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="historicalMarketPrices"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Historical Prices (JSON Array)</FormLabel>
                      <FormControl>
                        <Input placeholder="[2200, 2300, 2400]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Analyze Market
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>

      <div className="lg:col-span-3">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="font-headline">Recommendation</CardTitle>
            <CardDescription>Analysis result and price trend.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            )}
            {!loading && result && (
              <div className="space-y-6">
                 <div className={`flex items-center gap-4 rounded-lg p-4 ${result.recommendation === 'Sell' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'}`}>
                  {result.recommendation === 'Sell' ? <TrendingUp className="h-10 w-10 text-green-600" /> : <TrendingDown className="h-10 w-10 text-yellow-600" />}
                  <div>
                    <p className="text-sm text-muted-foreground">Recommendation</p>
                    <p className="text-2xl font-bold">{result.recommendation}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Rationale</h3>
                  <p className="text-muted-foreground">{result.rationale}</p>
                </div>
              </div>
            )}
             {!loading && !result && (
              <div className="flex h-64 items-center justify-center">
                <p className="text-muted-foreground">Results will appear here.</p>
              </div>
            )}
          </CardContent>
           <CardFooter>
              <MarketChart data={chartData} />
            </CardFooter>
        </Card>
      </div>
    </div>
    </>
  );
}
