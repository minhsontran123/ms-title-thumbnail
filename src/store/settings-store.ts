import { create } from "zustand";
import { persist } from "zustand/middleware";

export const GEMINI_TEXT_MODELS = [
  { id: "gemini-3.1-pro", label: "Gemini 3.1 Pro", badge: "Best" },
  { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro", badge: "" },
  { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash", badge: "Fast" },
];

export const ANTHROPIC_MODELS = [
  { id: "claude-opus-4-6", label: "Claude Opus 4.6", badge: "Best" },
  { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6", badge: "" },
  { id: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5", badge: "Fast" },
];

export const THUMBNAIL_MODEL = "gemini-3-pro-image-preview";

export function isAnthropicModel(model: string) {
  return model.startsWith("claude-");
}

interface SettingsStore {
  titleModel: string;
  textModel: string;
  setTitleModel: (model: string) => void;
  setTextModel: (model: string) => void;
}

// Only persist model selections — API keys are stored server-side
export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      titleModel: "gemini-3.1-pro",
      textModel: "gemini-3.1-pro",
      setTitleModel: (model) => set({ titleModel: model }),
      setTextModel: (model) => set({ textModel: model }),
    }),
    { name: "ms-app-settings" }
  )
);
