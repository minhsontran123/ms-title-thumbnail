import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { readKeys } from "@/lib/keys";

export async function POST(request: Request) {
  try {
    const { imageUrl, instruction } = await request.json();
    const keys = readKeys();
    const genai = new GoogleGenAI({ apiKey: keys.googleApiKey });

    // Extract base64 from data URL
    const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, "");

    // Nano Banana Pro can edit images directly — send image + instruction
    const response = await genai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "image/png",
                data: base64Data,
              },
            },
            {
              text: `Edit this YouTube thumbnail with the following change: "${instruction}". Keep everything else the same. Return the edited image.`,
            },
          ],
        },
      ],
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "2K",
        },
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) throw new Error("No response parts");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const imagePart = parts.find((p: any) => p.inlineData);
    if (!imagePart?.inlineData?.data) {
      throw new Error("No image generated");
    }

    const mime = imagePart.inlineData.mimeType || "image/jpeg";
    const newImageUrl = `data:${mime};base64,${imagePart.inlineData.data}`;

    return NextResponse.json({ imageUrl: newImageUrl });
  } catch (error) {
    console.error("Edit error:", error);
    return NextResponse.json(
      { error: "Failed to edit thumbnail" },
      { status: 500 }
    );
  }
}
