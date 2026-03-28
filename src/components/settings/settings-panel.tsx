"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Check } from "lucide-react";
import {
  useSettingsStore,
  GEMINI_TEXT_MODELS,
  ANTHROPIC_MODELS,
  THUMBNAIL_MODEL,
} from "@/store/settings-store";
import { vi } from "@/lib/vi";

function ApiKeyInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="text-[12px] font-semibold text-label-secondary uppercase tracking-wide block mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          className="apple-input w-full text-[13px] pr-16"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
        />
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-medium text-sys-blue"
          onClick={() => setShow((v) => !v)}
          type="button"
        >
          {show ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
      {value && (
        <p className="text-[11px] text-sys-green mt-1 flex items-center gap-1">
          <Check className="w-3 h-3" /> Key đã nhập
        </p>
      )}
    </div>
  );
}

function ModelSelector({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-[12px] font-semibold text-label-secondary uppercase tracking-wide block mb-2">
        {label}
      </label>

      {/* Gemini group */}
      <p className="text-[11px] font-semibold text-label-tertiary mb-1.5 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-sys-blue inline-block" />
        {vi.set_provider_gemini}
      </p>
      <div className="space-y-1.5 mb-3">
        {GEMINI_TEXT_MODELS.map((m) => (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] transition-all border ${
              value === m.id
                ? "border-sys-blue bg-sys-blue/6 text-label"
                : "border-separator bg-fill-secondary/50 text-label-secondary hover:bg-fill-secondary"
            }`}
          >
            <span className="font-medium">{m.label}</span>
            <div className="flex items-center gap-2">
              {m.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  m.badge === "Best" ? "bg-sys-orange/15 text-sys-orange" : "bg-sys-green/15 text-sys-green"
                }`}>
                  {m.badge === "Best" ? vi.set_badge_best : vi.set_badge_fast}
                </span>
              )}
              {value === m.id && <Check className="w-3.5 h-3.5 text-sys-blue" />}
            </div>
          </button>
        ))}
      </div>

      {/* Anthropic group */}
      <p className="text-[11px] font-semibold text-label-tertiary mb-1.5 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-sys-orange inline-block" />
        {vi.set_provider_anthropic}
      </p>
      <div className="space-y-1.5">
        {ANTHROPIC_MODELS.map((m) => (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] transition-all border ${
              value === m.id
                ? "border-sys-orange bg-sys-orange/6 text-label"
                : "border-separator bg-fill-secondary/50 text-label-secondary hover:bg-fill-secondary"
            }`}
          >
            <span className="font-medium">{m.label}</span>
            <div className="flex items-center gap-2">
              {m.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  m.badge === "Best" ? "bg-sys-orange/15 text-sys-orange" : "bg-sys-green/15 text-sys-green"
                }`}>
                  {m.badge === "Best" ? vi.set_badge_best : vi.set_badge_fast}
                </span>
              )}
              {value === m.id && <Check className="w-3.5 h-3.5 text-sys-orange" />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function SettingsPanel() {
  const {
    googleApiKey,
    setGoogleApiKey,
    anthropicApiKey,
    setAnthropicApiKey,
    titleModel,
    setTitleModel,
    textModel,
    setTextModel,
  } = useSettingsStore();

  return (
    <div className="flex flex-col h-full overflow-y-auto px-6 pb-8">
      {/* API Keys */}
      <div className="pt-5 space-y-4">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-[13px] font-semibold text-label">{vi.set_keys_title}</h2>
          <span className="text-[11px] text-sys-green flex items-center gap-1">
            <Check className="w-3 h-3" />
            {vi.set_saved}
          </span>
        </div>

        <ApiKeyInput
          label={vi.set_google_key}
          value={googleApiKey}
          onChange={setGoogleApiKey}
          placeholder={vi.set_google_key_ph}
        />

        <ApiKeyInput
          label={vi.set_anthropic_key}
          value={anthropicApiKey}
          onChange={setAnthropicApiKey}
          placeholder={vi.set_anthropic_key_ph}
        />
      </div>

      <div className="h-px bg-separator my-6" />

      {/* Models */}
      <div className="space-y-6">
        <h2 className="text-[13px] font-semibold text-label">{vi.set_models_title}</h2>

        <ModelSelector
          label={vi.set_title_model}
          value={titleModel}
          onChange={setTitleModel}
        />

        <div className="h-px bg-separator" />

        <ModelSelector
          label={vi.set_text_model}
          value={textModel}
          onChange={setTextModel}
        />

        <div className="h-px bg-separator" />

        {/* Thumbnail — locked */}
        <div>
          <label className="text-[12px] font-semibold text-label-secondary uppercase tracking-wide block mb-2">
            {vi.set_thumb_model}
          </label>
          <div className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-separator bg-fill-tertiary">
            <span className="text-[13px] font-medium text-label-secondary font-mono">
              {THUMBNAIL_MODEL}
            </span>
            <div className="flex items-center gap-1.5 text-label-tertiary">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-[11px] text-label-tertiary mt-1.5">{vi.set_thumb_model_locked}</p>
        </div>
      </div>
    </div>
  );
}
