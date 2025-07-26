
'use server';
/**
 * @fileOverview A simple chat flow for the voice assistant.
 *
 * - assistantChat - A function that takes a user query and returns a text response.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PagesSchema = z.enum(['dashboard', 'market-advisory', 'schemes']);

const navigateToPage = ai.defineTool(
  {
    name: 'navigateToPage',
    description: 'Navigates to a specific page in the application.',
    inputSchema: z.object({
      page: PagesSchema.describe('The page to navigate to.'),
    }),
    outputSchema: z.void(),
  },
  async (input) => {
    // This is a placeholder. The actual navigation is handled client-side.
    console.log(`(Server) Navigation request to: ${input.page}`);
  }
);

const AssistantChatInputSchema = z.object({
  query: z.string().describe("The user's voice query."),
});
export type AssistantChatInput = z.infer<typeof AssistantChatInputSchema>;

const AssistantChatOutputSchema = z.object({
  response: z.string().describe("The AI assistant's text response."),
  toolRequest: z.optional(z.any()),
});
export type AssistantChatOutput = z.infer<typeof AssistantChatOutputSchema>;

export async function assistantChat(
  input: AssistantChatInput
): Promise<AssistantChatOutput> {
  return assistantChatFlow(input);
}

const assistantChatFlow = ai.defineFlow(
  {
    name: 'assistantChatFlow',
    inputSchema: AssistantChatInputSchema,
    outputSchema: AssistantChatOutputSchema,
  },
  async (input) => {
    const response = await ai.generate({
      prompt: `User's query: ${input.query}`,
      model: 'googleai/gemini-1.5-flash-latest',
      tools: [navigateToPage],
      system:
        "You are a helpful voice assistant for the Namma Krushi app. Keep your answers concise and conversational. If the user asks to navigate to a page, use the 'navigateToPage' tool.",
      output: {
        format: 'json',
        schema: AssistantChatOutputSchema,
      },
    });

    const toolRequest = response.toolRequest;
    if (toolRequest) {
      console.log('Tool call requested:', toolRequest.tool.name);
      // The tool function itself doesn't need to be called here on the server
      // as the client will handle the navigation. We just need to pass the
      // tool request information back to the client.
      return {
        response: `Navigating to ${toolRequest.input.page}.`,
        toolRequest: toolRequest.json,
      };
    }

    return {
      response: response.output()?.response || 'Sorry, I could not process that.',
      toolRequest: undefined,
    };
  }
);
