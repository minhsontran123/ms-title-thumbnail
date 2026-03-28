import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const genai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY! });

export async function POST(request: Request) {
  try {
    const { step1, step2 } = await request.json();

    const response = await genai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Generate YouTube video metadata based on:

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

Return ONLY valid JSON, no markdown.`,
            },
          ],
        },
      ],
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    // Clean up potential markdown code blocks
    const cleaned = text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const metadata = JSON.parse(cleaned);

    return NextResponse.json(metadata);
  } catch (error) {
    console.error("Metadata error:", error);
    return NextResponse.json(
      {
        title: "Error generating metadata",
        description: "Please try again",
        tags: [],
      },
      { status: 500 }
    );
  }
}
