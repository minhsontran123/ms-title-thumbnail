import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { images, channelName, settings } = await request.json();
    const apiKey = settings?.googleApiKey || process.env.GOOGLE_AI_API_KEY!;
    const genai = new GoogleGenAI({ apiKey });

    if (!images || images.length === 0) {
      return NextResponse.json({ error: "Cần ít nhất 1 ảnh thumbnail mẫu" }, { status: 400 });
    }

    // Build parts: all images + analysis prompt
    const parts: { inlineData?: { mimeType: string; data: string }; text?: string }[] = [];

    for (const img of images) {
      const base64Data = img.replace(/^data:image\/\w+;base64,/, "");
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      });
    }

    parts.push({
      text: `You are an expert YouTube thumbnail designer and visual analyst.

Analyze these ${images.length} thumbnail(s) from the YouTube channel "${channelName || "unknown"}".

Extract a detailed STYLE PROFILE that can be used to generate new thumbnails in the exact same visual style. Be very specific about:

1. **Color Palette**: Dominant colors, accent colors, background tones, gradient usage
2. **Typography**: Font style (bold/thin/serif/sans), text size ratio, text placement, text effects (glow, shadow, outline, 3D)
3. **Composition**: Layout pattern, subject placement, use of negative space, focal points
4. **Lighting**: Lighting style (dramatic, flat, rim light, neon glow), contrast level
5. **Visual Effects**: Any overlays, textures, blur effects, vignettes, sparkles, arrows
6. **Mood & Tone**: Overall emotional vibe (energetic, dark, luxurious, urgent, educational)
7. **Recurring Elements**: Patterns that appear across multiple thumbnails (specific props, backgrounds, poses)
8. **Trading/Finance Specific**: Charts, candlesticks, money imagery, numbers, indicators

Write the style profile as a concise paragraph (150-200 words) that can be directly inserted into an image generation prompt. Start with "STYLE:" and write it as instructions for an AI image generator.

Respond in English only. Be specific, not vague.`,
    });

    const response = await genai.models.generateContent({
      model: "gemini-3.1-pro",
      contents: [{ role: "user", parts }],
    });

    const analysis = response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Analyze style error:", error);
    return NextResponse.json(
      { error: "Failed to analyze style" },
      { status: 500 }
    );
  }
}
