import { GoogleGenAI } from "@google/genai";
import Anthropic from "@anthropic-ai/sdk";
import { readKeys } from "@/lib/keys";

interface GenerateTextParams {
  prompt: string;
  model: string;
}

function isAnthropic(model: string) {
  return model.startsWith("claude-");
}

export async function generateText({
  prompt,
  model,
}: GenerateTextParams): Promise<string> {
  const keys = readKeys();

  if (isAnthropic(model)) {
    if (!keys.anthropicApiKey) throw new Error("Anthropic API key not configured");

    const client = new Anthropic({ apiKey: keys.anthropicApiKey });
    const message = await client.messages.create({
      model,
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const block = message.content[0];
    if (block.type !== "text") throw new Error("Unexpected response type");
    return block.text;
  } else {
    if (!keys.googleApiKey) throw new Error("Google AI API key not configured");

    const genai = new GoogleGenAI({ apiKey: keys.googleApiKey });
    const response = await genai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.text || "";
  }
}
