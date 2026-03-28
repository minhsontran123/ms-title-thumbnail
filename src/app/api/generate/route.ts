import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { buildPrompt } from "@/lib/build-prompt";
import { readKeys } from "@/lib/keys";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const prompt = buildPrompt(data);

    const keys = readKeys();
    const genai = new GoogleGenAI({ apiKey: keys.googleApiKey });

    const response = await genai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: prompt,
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "2K",
        },
      },
    });

    // Extract image from response parts
    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) throw new Error("No response parts");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const imagePart = parts.find((p: any) => p.inlineData);
    if (!imagePart?.inlineData?.data) {
      throw new Error("No image generated");
    }

    const mime = imagePart.inlineData.mimeType || "image/jpeg";
    const imageUrl = `data:${mime};base64,${imagePart.inlineData.data}`;

    return NextResponse.json({ imageUrl, prompt });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Failed to generate thumbnail" },
      { status: 500 }
    );
  }
}
