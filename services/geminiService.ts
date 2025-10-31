// import { GoogleGenAI } from "@google/genai"; // This line was removed to fix build errors.

const SYSTEM_INSTRUCTION = "You are CryptoGPT, an expert AI assistant specializing in cryptocurrency, blockchain, DeFi, NFTs, and Web3. Explain complex concepts clearly and concisely for users of all experience levels. Your tone is professional, helpful, and futuristic. When asked, you can offer short quizzes or recommend learning topics. Structure your answers in clear, simple point form using lists with dashes (-) or numbers. Do not use markdown formatting like asterisks (*) for bold/italics or hash symbols (#) for headings. All output should be plain text. All responses MUST be in point form.";

export const runAiTutorQuery = async (prompt: string): Promise<string> => {
  // The Gemini API integration has been disabled to resolve build errors.
  // The AI Tutor will now return a mock response.
  console.warn("Gemini API integration is disabled. Returning mock response.");
  return new Promise(resolve => setTimeout(() => resolve("The Gemini API key is not configured. This is a mock response explaining that you asked about: " + prompt), 1000));
};
