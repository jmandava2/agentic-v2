'use server';

/**
 * @fileOverview A market advisory AI agent.
 *
 * - analyzeMarketData - A function that handles the market data analysis process.
 * - AnalyzeMarketDataInput - The input type for the analyzeMarketData function.
 * - AnalyzeMarketDataOutput - The return type for the analyzeMarketData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMarketDataInputSchema = z.object({
  produce: z.string().describe('The type of produce to analyze.'),
  currentMarketPrice: z.number().describe('The current market price of the produce.'),
  historicalMarketPrices: z
    .string()
    .describe(
      'Historical market prices of the produce, as a JSON string array of prices.'
    ),
});
export type AnalyzeMarketDataInput = z.infer<typeof AnalyzeMarketDataInputSchema>;

const AnalyzeMarketDataOutputSchema = z.object({
  recommendation: z.enum(['Sell', 'Hold']).describe('The recommendation to sell or hold the produce.'),
  rationale: z.string().describe('The rationale behind the recommendation.'),
});
export type AnalyzeMarketDataOutput = z.infer<typeof AnalyzeMarketDataOutputSchema>;

export async function analyzeMarketData(
  input: AnalyzeMarketDataInput
): Promise<AnalyzeMarketDataOutput> {
  return analyzeMarketDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMarketDataPrompt',
  input: {schema: AnalyzeMarketDataInputSchema},
  output: {schema: AnalyzeMarketDataOutputSchema},
  prompt: `You are an expert agricultural market analyst.

You will analyze the market data for a given produce and provide a recommendation to either sell or hold the produce.

Consider the current market price and historical market prices to determine the trend and provide a rationale for your recommendation.

Produce: {{{produce}}}
Current Market Price: {{{currentMarketPrice}}}
Historical Market Prices: {{{historicalMarketPrices}}}

Recommendation:`,
});

const analyzeMarketDataFlow = ai.defineFlow(
  {
    name: 'analyzeMarketDataFlow',
    inputSchema: AnalyzeMarketDataInputSchema,
    outputSchema: AnalyzeMarketDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
