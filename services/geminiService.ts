import { GoogleGenAI, Type } from "@google/genai";
import { FoodAnalysisResult } from "../types";

// Initialize Gemini Client
// Expects process.env.API_KEY to be available
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

export const analyzeFoodImage = async (base64Image: string): Promise<FoodAnalysisResult> => {
  // Remove header if present (e.g., "data:image/jpeg;base64,")
  const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

  const prompt = `
    Analyze this image of food.
    Identify the dish, estimate the total calories, and provide a breakdown of macronutrients (Protein, Carbs, Fat) in grams.
    Also list the main visible ingredients with their estimated individual calorie contribution.
    Be realistic with portion sizes.
    Return a confidence score (0.0 to 1.0) based on how clear the food is.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: {
              type: Type.STRING,
              description: "A short, catchy name for the dish",
            },
            description: {
              type: Type.STRING,
              description: "A brief 1-sentence description of the meal",
            },
            totalCalories: {
              type: Type.INTEGER,
              description: "Total estimated calories",
            },
            macros: {
              type: Type.OBJECT,
              properties: {
                protein: { type: Type.NUMBER, description: "Protein in grams" },
                carbs: { type: Type.NUMBER, description: "Carbohydrates in grams" },
                fat: { type: Type.NUMBER, description: "Fats in grams" },
              },
              required: ["protein", "carbs", "fat"],
            },
            ingredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  estimatedCalories: { type: Type.INTEGER },
                },
                required: ["name", "estimatedCalories"],
              },
            },
            confidenceScore: {
              type: Type.NUMBER,
              description: "Confidence score between 0 and 1",
            },
          },
          required: ["foodName", "totalCalories", "macros", "ingredients", "confidenceScore"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as FoodAnalysisResult;
    } else {
      throw new Error("No text returned from model");
    }
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};