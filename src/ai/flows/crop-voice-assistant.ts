'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CropDataExtractionInputSchema = z.object({
  userInput: z.string().describe("The user's voice input"),
  questionContext: z.string().describe("The current question being asked"),
  fieldType: z.enum([
    'crop_name', 'crop_variety', 'current_crop', 'area', 'soil_type', 
    'water_source', 'irrigation_type', 'location', 'crop_stage', 'date'
  ]).describe("The type of field being collected"),
});

const CropDataExtractionOutputSchema = z.object({
  extractedValue: z.string().describe("The cleaned and formatted extracted value"),
  confidence: z.number().min(0).max(1).describe("Confidence score of the extraction"),
  needsClarification: z.boolean().describe("Whether the input needs clarification"),
  clarificationQuestion: z.string().optional().describe("Follow-up question if clarification needed"),
});

export type CropDataExtractionInput = z.infer<typeof CropDataExtractionInputSchema>;
export type CropDataExtractionOutput = z.infer<typeof CropDataExtractionOutputSchema>;

export async function extractCropData(
  input: CropDataExtractionInput
): Promise<CropDataExtractionOutput> {
  return cropDataExtractionFlow(input);
}

const cropDataExtractionFlow = ai.defineFlow(
  {
    name: 'cropDataExtractionFlow',
    inputSchema: CropDataExtractionInputSchema,
    outputSchema: CropDataExtractionOutputSchema,
  },
  async (input) => {
    const { userInput, questionContext, fieldType } = input;
    
    let systemPrompt = `You are an expert at extracting agricultural data from voice input. 
    
Current question context: "${questionContext}"
Field type being collected: ${fieldType}
User's voice input: "${userInput}"

Extract and format the relevant information based on the field type:

CROP_NAME: Extract crop names (Rice, Wheat, Cotton, Tomato, etc.)
CROP_VARIETY: Extract variety names (Basmati, Sona Masoori, BT Cotton, etc.)
CURRENT_CROP: Extract the current crop growing
AREA: Extract numeric values for acres/hectares (convert words to numbers: "five" -> "5")
SOIL_TYPE: Extract soil types (clay, loam, sandy, black, red, alluvial, etc.)
WATER_SOURCE: Extract water sources (ground water, river water, rain water, bore well, etc.)
IRRIGATION_TYPE: Extract irrigation methods (drip system, sprinkler, flood irrigation, etc.)
LOCATION: Extract addresses, villages, districts, states
CROP_STAGE: Extract growth stages (seedling, vegetative, flowering, maturity, golden, etc.)
DATE: Extract and format dates to YYYY-MM-DD format

Rules:
1. Return only the clean extracted value
2. Convert spoken numbers to digits ("five acres" -> "5")
3. Standardize terms (e.g., "ground water" not "groundwater")
4. For dates, convert to ISO format (YYYY-MM-DD)
5. If input is unclear or doesn't match the field type, set needsClarification to true

Examples:
- Input: "I want to plant rice" for crop_name -> "Rice"
- Input: "we have five acres" for area -> "5"
- Input: "clay soil" for soil_type -> "clay"
- Input: "July 15th 2024" for date -> "2024-07-15"`;

    const llmResponse = await ai.generate({
      prompt: systemPrompt,
      model: 'googleai/gemini-1.5-flash-latest',
      config: {
        temperature: 0.1, // Low temperature for consistent extraction
      },
    });

    const responseText = llmResponse.text || '';
    
    // Parse the response to determine if clarification is needed
    const needsClarification = responseText.toLowerCase().includes('unclear') || 
                              responseText.toLowerCase().includes('not sure') ||
                              responseText.toLowerCase().includes('clarification') ||
                              responseText.length < 2;
    
    let extractedValue = responseText.trim();
    let confidence = 0.9;
    
    // Lower confidence for ambiguous responses
    if (needsClarification || extractedValue.includes('?')) {
      confidence = 0.3;
    }
    
    // Clean up the extracted value
    extractedValue = extractedValue.replace(/['"]/g, '').trim();
    
    let clarificationQuestion = undefined;
    if (needsClarification) {
      clarificationQuestion = generateClarificationQuestion(fieldType, userInput);
    }
    
    return {
      extractedValue,
      confidence,
      needsClarification,
      clarificationQuestion,
    };
  }
);

function generateClarificationQuestion(fieldType: string, userInput: string): string {
  switch (fieldType) {
    case 'crop_name':
      return "I didn't catch the crop name clearly. Could you please say which crop you want to add? For example, Rice, Wheat, or Cotton?";
    case 'area':
      return "Could you please specify the area in acres? For example, say 'five acres' or 'ten acres'?";
    case 'soil_type':
      return "What type of soil do you have? Please choose from clay, loam, sandy, or black soil?";
    case 'date':
      return "Could you please say the date more clearly? For example, 'July 15th 2024' or 'January 1st 2025'?";
    default:
      return "I didn't understand that clearly. Could you please repeat your answer?";
  }
}