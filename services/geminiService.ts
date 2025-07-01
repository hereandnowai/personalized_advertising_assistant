import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { StructuredResponse, ResponseVerbosity } from '../types';
import { 
    GEMINI_MODEL, 
    SYSTEM_INSTRUCTION_BASE, 
    GEMINI_TEMPERATURE,
    VERBOSITY_INSTRUCTION_CONCISE,
    VERBOSITY_INSTRUCTION_DETAILED
} from '../constants';

const API_KEY = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.error("Gemini API Key (process.env.API_KEY) is not set. The application may not function correctly.");
}

const parseJsonResponse = (responseText: string): StructuredResponse | null => {
  let jsonStr = responseText.trim();
  const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[1]) {
    jsonStr = match[1].trim();
  }
  
  try {
    const parsed = JSON.parse(jsonStr);
    if (
      parsed && typeof parsed === 'object' &&
      ('audienceInsights' in parsed || 
      'personalizationStrategy' in parsed ||
      'creativeSuggestions' in parsed ||
      'channelRecommendations' in parsed ||
      'successMetrics' in parsed) &&
      ('suggestedFollowUps' in parsed && Array.isArray(parsed.suggestedFollowUps))
    ) {
      return parsed as StructuredResponse;
    }
    console.warn("Parsed JSON does not fully match expected StructuredResponse format, or missing suggestedFollowUps:", parsed);
    if (typeof parsed === 'object' && parsed !== null) {
        if (!('suggestedFollowUps' in parsed) || !Array.isArray(parsed.suggestedFollowUps)) {
            (parsed as StructuredResponse).suggestedFollowUps = [];
        }
        return parsed as StructuredResponse;
    }
    throw new Error("Parsed content is not a valid structured response object.");
  } catch (e) {
    console.error("Failed to parse JSON response:", e, "Original text:", responseText);
    throw new Error(`Failed to parse AI response as JSON. Ensure the AI returns only a valid JSON object. Raw response: ${responseText}`);
  }
};

export const geminiService = {
  generatePersonalizedAdPlan: async (userInput: string, verbosity: ResponseVerbosity): Promise<StructuredResponse> => {
    if (!ai) {
      console.error("Gemini AI client is not initialized. API Key might be missing.");
      throw new Error("Personalized Advertising Assistant is currently unavailable. Please check API Key and try again later.");
    }

    let verbosityInstruction = "";
    if (verbosity === 'concise') {
        verbosityInstruction = VERBOSITY_INSTRUCTION_CONCISE;
    } else if (verbosity === 'detailed') {
        verbosityInstruction = VERBOSITY_INSTRUCTION_DETAILED;
    }

    const finalSystemInstruction = SYSTEM_INSTRUCTION_BASE.replace('{{VERBOSITY_INSTRUCTION}}', verbosityInstruction);

    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [{ role: "user", parts: [{text: userInput}] }],
        config: {
          systemInstruction: finalSystemInstruction,
          temperature: GEMINI_TEMPERATURE,
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Received empty response from AI.");
      }
      
      const structuredData = parseJsonResponse(responseText);
      if (!structuredData) { 
        throw new Error("AI response could not be parsed into the expected structured format, or was empty after parsing.");
      }
      return structuredData;

    } catch (error) {
      console.error('Gemini API error:', error);
      if (error instanceof Error) {
        throw new Error(`Error generating plan: ${error.message}. Please check your input or try again.`);
      }
      throw new Error('An unknown error occurred while communicating with the AI service.');
    }
  },
};