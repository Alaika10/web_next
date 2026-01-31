
import { GoogleGenAI, Type } from "@google/genai";

// Moved GoogleGenAI instantiation inside functions to ensure the latest API key is used
// and switched to gemini-3-pro-preview for complex text generation tasks.

/**
 * Generates a blog post draft using Gemini 3 Pro.
 * Uses responseSchema to ensure the output matches the expected JSON structure.
 */
export const generateBlogDraft = async (topic: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Write a compelling blog post draft about "${topic}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "The title of the blog post",
            },
            excerpt: {
              type: Type.STRING,
              description: "A short, engaging summary of the post",
            },
            content: {
              type: Type.STRING,
              description: "The main body content of the post in markdown format",
            },
          },
          required: ["title", "excerpt", "content"],
        },
      },
    });
    
    const jsonStr = response.text;
    return jsonStr ? JSON.parse(jsonStr) : null;
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};

/**
 * Generates a professional project description using Gemini 3 Flash.
 */
export const generateProjectDescription = async (projectName: string, tech: string[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a professional project description for a project named "${projectName}" built with ${tech.join(', ')}. Keep it under 100 words.`,
    });
    // Accessing .text as a property as per SDK guidelines
    return response.text || "Failed to generate description.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate description.";
  }
};
