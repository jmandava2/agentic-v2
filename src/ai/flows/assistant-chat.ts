
'use server';
/**
 * @fileOverview A simple chat flow for the voice assistant.
 *
 * - assistantChat - A function that takes a user query and returns a text response.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { generate, run, astream } from 'genkit/flow';

const PagesSchema = z.enum(['dashboard', 'market', 'health', 'analytics', 'schemes', 'profile']);
const LanguagesSchema = z.enum(['en', 'kn']);

const navigateToPage = ai.defineTool(
  {
    name: 'navigateToPage',
    description: 'Navigates to a specific page in the application.',
    inputSchema: z.object({
      page: PagesSchema.describe('The page to navigate to.'),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    // This is a placeholder. The actual navigation is handled client-side.
    console.log(`(Server) Navigation request to: ${input.page}`);
    return `Navigating to ${input.page}`;
  }
);

const changeLanguage = ai.defineTool(
  {
    name: 'changeLanguage',
    description: 'Changes the application language.',
    inputSchema: z.object({
      language: LanguagesSchema.describe("The language to switch to. 'kn' for Kannada, 'en' for English."),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    // This is a placeholder. The actual language change is handled client-side.
    console.log(`(Server) Language change request to: ${input.language}`);
    return `Changing language to ${input.language === 'kn' ? 'Kannada' : 'English'}`;
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
    const llmResponse = await generate({
      prompt: `User's query: ${input.query}`,
      model: 'googleai/gemini-1.5-flash-latest',
      tools: [navigateToPage, changeLanguage],
      system:
        "You are a helpful voice assistant for the Namma Krushi app. Keep your answers concise and conversational. If the user asks to navigate to a page, use the 'navigateToPage' tool. If the user asks to change language, use the 'changeLanguage' tool.",
    });

    const toolRequest = llmResponse.toolRequest();
    if (toolRequest) {
      console.log('Tool call requested:', toolRequest.tool.name, 'with input:', toolRequest.input);
       const toolResponse = await run('run-tool', async () =>
        toolRequest.tool.fn(toolRequest.input)
      );

      return {
        response: toolResponse,
        toolRequest: { // Sending the original request back to the client
          name: toolRequest.tool.name,
          input: toolRequest.input
        },
      };
    }

    const textResponse = llmResponse.text();
    return {
      response: textResponse || 'Sorry, I could not process that.',
      toolRequest: undefined,
    };
  }
);
