import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const genai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY! });

const AUDIENCE_LABEL: Record<string, string> = {
  newbie: "người mới bắt đầu trade",
  intermediate: "trader có kinh nghiệm",
  advanced: "trader chuyên nghiệp",
  general: "tất cả đối tượng",
};

export async function POST(request: Request) {
  try {
    const { topic, audience } = await request.json();

    const audienceLabel = AUDIENCE_LABEL[audience] ?? "tất cả đối tượng";

    const prompt = `Bạn là chuyên gia tối ưu hóa tiêu đề YouTube cho kênh trading/tài chính/lifestyle trader tiếng Việt.

Chủ đề video: "${topic}"
Đối tượng: ${audienceLabel}

Tạo ĐÚNG 12 tiêu đề YouTube tiếng Việt theo 12 công thức khác nhau. Mỗi tiêu đề:
- Tối đa 70 ký tự
- Tự nhiên, không cứng nhắc
- Phù hợp kênh trading/forex/crypto/lifestyle trader Việt Nam

Trả về JSON array với đúng 12 phần tử, mỗi phần tử gồm:
{
  "title": "...",
  "formula": "Tên công thức ngắn gọn (3-5 từ)",
  "formulaKey": một trong ["loss_number","warning","secret","journey","result","question","comparison","controversy","mistake","how_to","exclusive","beginner"],
  "score": số từ 60-98 (điểm tổng dựa trên cảm xúc, rõ ràng, tò mò, power words, SEO),
  "scores": {
    "emotion": 0-100,
    "clarity": 0-100,
    "curiosity": 0-100,
    "powerWords": 0-100,
    "seo": 0-100
  },
  "suggestedEmotionalTrigger": một trong ["shock","curiosity","fomo","inspiration","controversy"],
  "suggestedTextOverlay": "1-4 từ mạnh để dùng làm chữ trên thumbnail",
  "suggestedPrimaryColor": mã hex màu phù hợp với cảm xúc của title này
}

Mỗi formulaKey phải xuất hiện đúng 1 lần. Trả về ONLY JSON array, không có markdown.`;

    const response = await genai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    const cleaned = text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const titles = JSON.parse(cleaned);

    // Attach unique ids
    const withIds = titles.map((t: object, i: number) => ({
      id: `title-${Date.now()}-${i}`,
      ...t,
    }));

    return NextResponse.json({ titles: withIds });
  } catch (error) {
    console.error("Title generation error:", error);
    return NextResponse.json({ error: "Failed to generate titles" }, { status: 500 });
  }
}
