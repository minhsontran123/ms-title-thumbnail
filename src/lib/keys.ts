import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const KEYS_FILE = join(process.cwd(), ".keys.json");

export interface StoredKeys {
  googleApiKey: string;
  anthropicApiKey: string;
}

const DEFAULT_KEYS: StoredKeys = {
  googleApiKey: "",
  anthropicApiKey: "",
};

export function readKeys(): StoredKeys {
  // Fallback to env vars if no keys file
  const envKeys: StoredKeys = {
    googleApiKey: process.env.GOOGLE_AI_API_KEY || "",
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || "",
  };

  if (!existsSync(KEYS_FILE)) return envKeys;

  try {
    const data = JSON.parse(readFileSync(KEYS_FILE, "utf-8"));
    return {
      googleApiKey: data.googleApiKey || envKeys.googleApiKey,
      anthropicApiKey: data.anthropicApiKey || envKeys.anthropicApiKey,
    };
  } catch {
    return envKeys;
  }
}

export function writeKeys(keys: Partial<StoredKeys>) {
  const current = readKeys();
  const updated = { ...current, ...keys };
  writeFileSync(KEYS_FILE, JSON.stringify(updated, null, 2), "utf-8");
}

export function maskKey(key: string): string {
  if (!key || key.length < 8) return key ? "••••••••" : "";
  return key.slice(0, 4) + "••••••••" + key.slice(-4);
}
