import { NextResponse } from "next/server";
import { generateText } from "@/lib/ai-text";

export async function POST(request: Request) {
  try {
    const { step1, step2, settings } = await request.json();
    const model = settings?.textModel || "gemini-2.5-flash";

    const prompt = `Generate YouTube video metadata based on:

Topic: ${step1.videoTopic}
Title: ${step1.videoTitle}
Audience: ${step1.audience}
Pain Point: ${step1.painPoint}
Problem: ${step2.currentProblem}
Desired Result: ${step2.desiredResult}

Return a JSON object with:
- "title": An optimized, click-worthy YouTube title (max 70 chars)
- "description": A compelling video description (200-300 words) with relevant keywords, timestamps placeholder, and call to action
- "tags": An array of 15-20 relevant tags/keywords

Return ONLY valid JSON, no markdown.`;

    const text = await generateText({ prompt, model });

    const cleaned = text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const metadata = JSON.parse(cleaned);

    return NextResponse.json(metadata);
  } catch (error) {
    console.error("Metadata error:", error);
    return NextResponse.json(
      { title: "Error generating metadata", description: "Please try again", tags: [] },
      { status: 500 }
    );
  }
}
