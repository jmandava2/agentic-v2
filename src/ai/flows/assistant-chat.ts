
'use server';
/**
 * @fileOverview A simple chat flow for the voice assistant.
 *
 * - assistantChat - A function that takes a user query and returns a text response.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AssistantChatInputSchema = z.object({
  query: z.string().describe('The user\'s voice query.'),
});
export type AssistantChatInput = z.infer<typeof AssistantChatInputSchema>;

const AssistantChatOutputSchema = z.object({
  response: z.string().describe('The AI assistant\'s text response.'),
});
export type AssistantChatOutput = z.infer<typeof AssistantChatOutputSchema>;

export async function assistantChat(
  input: AssistantChatInput
): Promise<AssistantChatOutput> {
  return assistantChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assistantChatPrompt',
  input: { schema: AssistantChatInputSchema },
  output: { schema: AssistantChatOutputSchema },
  prompt: `You are a helpful voice assistant for the Namma Krushi app. Keep your answers concise and conversational.

User's query: {{{query}}}

Your response:`,
});

const assistantChatFlow = ai.defineFlow(
  {
    name: 'assistantChatFlow',
    inputSchema: AssistantChatInputSchema,
    outputSchema: AssistantChatOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
