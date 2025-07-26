'use server';

/**
 * @fileOverview A flow to generate personalized to-do lists for farmers based on farm state, weather, and crop lifecycle.
 *
 * - generateFarmTodos - A function that generates a personalized to-do list for a farm.
 * - GenerateFarmTodosInput - The input type for the generateFarmTodos function.
 * - GenerateFarmTodosOutput - The return type for the generateFarmTodos function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WeatherSchema = z.object({
  temperature: z.number().describe('The current temperature in Celsius.'),
  humidity: z.number().describe('The current humidity percentage.'),
  forecast: z.string().describe('A brief text description of the weather forecast for the day.'),
});

const CropLifecycleStageSchema = z.enum([
  'seedling',
  'vegetative',
  'reproductive',
  'maturity',
]);

const FarmStateSchema = z.object({
  soilMoisture: z
    .number()
    .describe('The current soil moisture level as a percentage.'),
  pestPressure: z
    .string()
    .describe('A description of the current pest pressure on the farm.'),
  diseaseRisk: z
    .string()
    .describe('A description of the current disease risk for the crops.'),
});

const GenerateFarmTodosInputSchema = z.object({
  farmName: z.string().describe('The name of the farm.'),
  weather: WeatherSchema.describe('The current weather conditions and forecast.'),
  crop: z.string().describe('The type of crop being grown.'),
  cropLifecycleStage: CropLifecycleStageSchema.describe(
    'The current lifecycle stage of the crop.'
  ),
  farmState: FarmStateSchema.describe('The current state of the farm.'),
});
export type GenerateFarmTodosInput = z.infer<typeof GenerateFarmTodosInputSchema>;

const GenerateFarmTodosOutputSchema = z.object({
  todos: z
    .array(z.string())
    .describe('A list of personalized to-do items for the farm.'),
});
export type GenerateFarmTodosOutput = z.infer<typeof GenerateFarmTodosOutputSchema>;

export async function generateFarmTodos(input: GenerateFarmTodosInput): Promise<GenerateFarmTodosOutput> {
  return generateFarmTodosFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFarmTodosPrompt',
  input: {schema: GenerateFarmTodosInputSchema},
  output: {schema: GenerateFarmTodosOutputSchema},
  prompt: `You are an AI farm assistant. Generate a list of personalized to-do items for the farm, taking into account the current weather, crop type, crop lifecycle stage, and farm state.

Farm Name: {{{farmName}}}
Weather: {{{weather.forecast}}}, Temperature: {{{weather.temperature}}}°C, Humidity: {{{weather.humidity}}}%
Crop: {{{crop}}}
Crop Lifecycle Stage: {{{cropLifecycleStage}}}
Farm State: Soil Moisture: {{{farmState.soilMoisture}}}%, Pest Pressure: {{{farmState.pestPressure}}}, Disease Risk: {{{farmState.diseaseRisk}}}

To-Do Items:`,
});

const generateFarmTodosFlow = ai.defineFlow(
  {
    name: 'generateFarmTodosFlow',
    inputSchema: GenerateFarmTodosInputSchema,
    outputSchema: GenerateFarmTodosOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
