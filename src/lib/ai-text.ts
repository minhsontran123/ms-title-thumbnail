import { GoogleGenAI } from "@google/genai";
import Anthropic from "@anthropic-ai/sdk";

interface GenerateTextParams {
  prompt: string;
  model: string;
  googleApiKey?: string;
  anthropicApiKey?: string;
}

function isAnthropic(model: string) {
  return model.startsWith("claude-");
}

export async function generateText({
  prompt,
  model,
  googleApiKey,
  anthropicApiKey,
}: GenerateTextParams): Promise<string> {
  if (isAnthropic(model)) {
    const key = anthropicApiKey || process.env.ANTHROPIC_API_KEY;
    if (!key) throw new Error("Anthropic API key not configured");

    const client = new Anthropic({ apiKey: key });
    const message = await client.messages.create({
      model,
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const block = message.content[0];
    if (block.type !== "text") throw new Error("Unexpected response type");
    return block.text;
  } else {
    const key = googleApiKey || process.env.GOOGLE_AI_API_KEY;
    if (!key) throw new Error("Google AI API key not configured");

    const genai = new GoogleGenAI({ apiKey: key });
    const response = await genai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.text || "";
  }
}
