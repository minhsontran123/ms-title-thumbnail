import { NextResponse } from "next/server";
import { readKeys, writeKeys, maskKey } from "@/lib/keys";

// GET — return masked keys (never return full keys to client)
export async function GET() {
  const keys = readKeys();
  return NextResponse.json({
    googleApiKey: maskKey(keys.googleApiKey),
    anthropicApiKey: maskKey(keys.anthropicApiKey),
    hasGoogle: !!keys.googleApiKey,
    hasAnthropic: !!keys.anthropicApiKey,
  });
}

// POST — save keys server-side
export async function POST(request: Request) {
  try {
    const { googleApiKey, anthropicApiKey } = await request.json();

    const updates: Record<string, string> = {};
    if (typeof googleApiKey === "string") updates.googleApiKey = googleApiKey;
    if (typeof anthropicApiKey === "string") updates.anthropicApiKey = anthropicApiKey;

    writeKeys(updates);

    const keys = readKeys();
    return NextResponse.json({
      googleApiKey: maskKey(keys.googleApiKey),
      anthropicApiKey: maskKey(keys.anthropicApiKey),
      hasGoogle: !!keys.googleApiKey,
      hasAnthropic: !!keys.anthropicApiKey,
    });
  } catch (error) {
    console.error("Settings error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
