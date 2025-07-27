
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
    
    let systemPrompt = `You are an expert at extracting agricultural data from user input, which may be in English or Kannada. 
    
Current question context: "${questionContext}"
Field type being collected: ${fieldType}
User's input: "${userInput}"

Your task is to extract the relevant piece of information from the user's input that directly answers the question.

Here are the extraction rules for each field type:
- CROP_NAME: Extract only the name of the crop (e.g., "Rice", "Wheat", "Cotton", "Tomato", "ಭತ್ತ", "ಗೋಧಿ").
- CROP_VARIETY: Extract the specific variety name (e.g., "Basmati", "Sona Masoori", "ಬಾಸಮತಿ").
- CURRENT_CROP: Extract the name of the crop currently growing.
- AREA: Extract only the numeric value for acres/hectares. Convert words to numbers (e.g., "five" -> "5", "ಐದು" -> "5"). Do not include units like 'acres'.
- SOIL_TYPE: Extract soil types (e.g., "clay", "loam", "sandy", "black", "red", "alluvial", "ಕೆಂಪು ಮಣ್ಣು", "ಕಪ್ಪು ಮಣ್ಣು").
- WATER_SOURCE: Extract water sources (e.g., "ground water", "river water", "rain water", "bore well", "ನದಿ ನೀರು").
- IRRIGATION_TYPE: Extract irrigation methods (e.g., "drip system", "sprinkler", "flood irrigation", "ಹನಿ ನೀರಾವರಿ").
- LOCATION: Extract addresses, villages, districts, states.
- CROP_STAGE: Extract growth stages (e.g., "seedling", "vegetative", "flowering", "maturity", "golden", "ಸಸಿ").
- DATE: Extract and format dates to YYYY-MM-DD format. Understand various date formats in both English and Kannada.

IMPORTANT RULES:
1.  **Return only the single, clean, extracted value.** Do not add any extra words, explanations, or labels.
2.  Convert spoken numbers to digits ("five acres" -> "5", "ಹತ್ತು ಎಕರೆ" -> "10").
3.  Standardize common terms where possible (e.g., "ground water" not "groundwater").
4.  For dates, always convert to YYYY-MM-DD ISO format.
5.  If the input is unclear, ambiguous, or does not seem to answer the question for the specified field type, you MUST set 'needsClarification' to true.
6.  If the input contains a question back to the system, it needs clarification.

Examples:
- User Input: "I want to plant rice" for field_type 'crop_name' -> "Rice"
- User Input: "we have five acres" for field_type 'area' -> "5"
- User Input: "the soil is black soil" for field_type 'soil_type' -> "black"
- User Input: "July 15th 2024" for field_type 'date' -> "2024-07-15"
- User Input: "What should I enter here?" for any field_type -> set needsClarification=true`;

    const { output } = await ai.generate({
      prompt: systemPrompt,
      model: 'googleai/gemini-1.5-flash-latest',
      output: { schema: CropDataExtractionOutputSchema },
      config: {
        temperature: 0.1, // Low temperature for consistent extraction
      },
    });

    if (!output) {
      // Fallback or error handling
      return {
        extractedValue: '',
        confidence: 0,
        needsClarification: true,
        clarificationQuestion: "I'm sorry, I couldn't process that. Could you try again?",
      };
    }
    
    // If the model itself decided it needs clarification, trust it.
    if(output.needsClarification) {
        output.clarificationQuestion = output.clarificationQuestion || generateClarificationQuestion(fieldType, userInput);
        return output;
    }

    // Post-processing and validation
    let extractedValue = output.extractedValue.trim().replace(/['"]/g, '');
    let confidence = output.confidence;

    // Additional check for ambiguity
    if (extractedValue.length < 2 || extractedValue.includes('?')) {
        output.needsClarification = true;
        confidence = 0.3;
    }
    
    if (output.needsClarification) {
      output.clarificationQuestion = generateClarificationQuestion(fieldType, userInput);
    }
    
    return { ...output, extractedValue, confidence };
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

    