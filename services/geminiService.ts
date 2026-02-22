import { GoogleGenAI } from "@google/genai";
import { AIAnalysisResult } from "../types";

// This service is client-side only for this demo.
// In a real app, you might proxy this through your backend to keep keys secure,
// OR use the user's key if it's a BYOK (Bring Your Own Key) app.
// Here we use process.env.API_KEY as per instructions.

export const checkPhotoCompliance = async (
  base64Image: string,
  countryName: string
): Promise<AIAnalysisResult> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("No API Key found. Skipping AI check.");
      return {
        isValid: true,
        issues: ["API Key missing - assuming valid for demo"],
        suggestions: [],
        score: 100
      };
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Remove header from base64 if present
    const base64Data = base64Image.split(',')[1] || base64Image;

    const prompt = `
      Analyze this passport photo candidate for ${countryName} standards.
      Check for:
      1. Eyes open and visible (no glasses glare).
      2. Neutral facial expression.
      3. Even lighting (no harsh shadows).
      4. Plain, uniform background.
      5. Head straight (no significant tilt).
      
      Return a valid JSON object ONLY (no markdown formatting) with the following structure:
      {
        "isValid": boolean,
        "issues": ["string"],
        "suggestions": ["string"],
        "score": number
      }
    `;

    // Note: responseSchema/responseMimeType is not supported for gemini-2.5-flash-image (nano banana).
    // We must rely on the prompt to get JSON.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
          { text: prompt }
        ]
      }
    });

    let text = response.text;
    if (!text) throw new Error("No response from AI");

    // Clean up potential markdown code blocks
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
    console.error("AI Compliance Check Failed:", error);
    // Fallback to "optimistic" valid so user isn't blocked by AI error
    return {
      isValid: true,
      issues: ["AI check unavailable"],
      suggestions: ["Please manually verify requirements."],
      score: 80
    };
  }
};