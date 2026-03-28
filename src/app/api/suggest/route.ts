import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const genai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY! });

export async function POST(request: Request) {
  try {
    const { videoTopic, videoTitle } = await request.json();

    const input = videoTitle || videoTopic;
    if (!input) {
      return NextResponse.json({ error: "Cần nhập chủ đề hoặc tiêu đề video" }, { status: 400 });
    }

    const response = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Bạn là chuyên gia YouTube về niche trading, giao dịch quỹ, trader lifestyle.

Dựa vào thông tin video: "${input}"

Hãy gợi ý JSON (không markdown, chỉ JSON thuần) với các trường sau:
{
  "videoTopic": "chủ đề ngắn gọn",
  "videoTitle": "tiêu đề video hấp dẫn, gây tò mò, dưới 60 ký tự",
  "painPoint": "nỗi đau của người xem liên quan đến chủ đề này",
  "audience": "newbie" hoặc "intermediate" hoặc "advanced" hoặc "general"
}

Trả lời bằng tiếng Việt tự nhiên. Chỉ trả về JSON, không giải thích gì thêm.`,
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const cleaned = text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleaned);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Suggest error:", error);
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 });
  }
}
