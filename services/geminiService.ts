
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  sources?: { title: string; uri: string }[];
}

const SYSTEM_INSTRUCTION = `
You are 'CryptoGuy', the dedicated AI Tutor for the CryptoGuyTECH platform.

YOUR MISSION:
Assist users in understanding the Blockchain and Cryptocurrency ecosystem. You are a specialized expert.

RULES:
1. **SCOPE**: answer ONLY questions related to Crypto, Blockchain, Web3, DeFi, Trading, and financial technology. If a user asks about non-crypto topics (e.g., cooking, politics, sports), politely refuse and steer them back to crypto.
2. **FORMAT**: You MUST provide answers in **BULLET POINT** form. Do not write long paragraphs.
3. **TONE**: Beginner-friendly, encouraging, and clear. Avoid overly dense jargon without explanation.
4. **ILLUSTRATION**: For every concept explained, you MUST provide an "Illustration" section. Since you are text-based, use **ASCII Art diagrams**, **Emoji Flows**, or **Step-by-Step analogies** to visually explain the concept.
   - Example: [User] -> (Key) -> [Wallet]
5. **REAL-TIME**: Use the googleSearch tool to find the absolute latest news, prices, and developments when relevant.

EXAMPLE OUTPUT STRUCTURE:
* **Key Concept**: Brief definition.
* **Details**:
  * Point 1
  * Point 2
* **Illustration**:
  (ASCII Art or Emoji Flow here)
`;

export const chatWithGemini = async (history: ChatMessage[], message: string): Promise<ChatMessage> => {
  if (!ai) {
    throw new Error("API Key is missing. Please check your configuration.");
  }

  try {
    // Convert internal history format to Gemini format if needed, 
    // but for single turn with context, we often just send the prompt with context.
    // For this implementation, we will use generateContent with the system instruction.

    // Construct the prompt with history context for continuity (simplified context window)
    const contextPrompt = history.map(h => `${h.role === 'user' ? 'User' : 'CryptoGuy'}: ${h.text}`).join('\n');
    const fullPrompt = `${contextPrompt}\nUser: ${message}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // High intelligence model for complex explanations
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }], // Enable real-time news
      },
    });

    const generatedText = response.text || "I couldn't generate a response. Please try again.";
    
    // Extract Grounding Metadata (Sources)
    let sources: { title: string; uri: string }[] = [];
    
    // Check for grounding chunks in the candidates
    const candidate = response.candidates?.[0];
    if (candidate?.groundingMetadata?.groundingChunks) {
        candidate.groundingMetadata.groundingChunks.forEach((chunk: any) => {
            if (chunk.web) {
                sources.push({
                    title: chunk.web.title || 'Source',
                    uri: chunk.web.uri
                });
            }
        });
    }

    // Deduplicate sources
    sources = sources.filter((source, index, self) =>
        index === self.findIndex((t) => (
            t.uri === source.uri
        ))
    );

    return {
      role: 'model',
      text: generatedText,
      sources: sources.length > 0 ? sources : undefined
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      role: 'model',
      text: "I'm having trouble connecting to the blockchain right now. Please try again later.",
    };
  }
};
