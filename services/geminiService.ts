import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = "You are CryptoGPT, an expert AI assistant specializing in cryptocurrency, blockchain, DeFi, NFTs, and Web3. Explain complex concepts clearly and concisely for users of all experience levels. Your tone is professional, helpful, and futuristic. When asked, you can offer short quizzes or recommend learning topics. Structure your answers in clear, simple point form using lists with dashes (-) or numbers. Do not use markdown formatting like asterisks (*) for bold/italics or hash symbols (#) for headings. All output should be plain text. All responses MUST be in point form.";

export const runAiTutorQuery = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    // This is a fallback for local development or if the key is missing.
    // In a real production environment, you might handle this differently.
    console.warn("API_KEY environment variable not set. Returning mock response.");
    return new Promise(resolve => setTimeout(() => resolve("The Gemini API key is not configured. This is a mock response explaining that you asked about: " + prompt), 1000));
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, I encountered an error while processing your request. Please try again later.";
  }
};