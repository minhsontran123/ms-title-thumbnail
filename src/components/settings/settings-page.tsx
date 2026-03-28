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
    <div className="space-y-1.5">
      <label className="text-[13px] font-semibold text-label block">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          className="apple-input w-full text-[13px] pr-12"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
        />
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 text-label-tertiary hover:text-label transition-colors"
          onClick={() => setShow((v) => !v)}
          type="button"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {value && (
        <p className="text-[12px] text-sys-green flex items-center gap-1">
          <Check className="w-3 h-3" /> Đã nhập
        </p>
      )}
    </div>
  );
}

function ModelGroup({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-[13px] font-semibold text-label">{label}</p>

      <div>
        <p className="text-[12px] font-medium text-label-tertiary mb-2 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-sys-blue inline-block" />
          {vi.set_provider_gemini}
        </p>
        <div className="space-y-1.5">
          {GEMINI_TEXT_MODELS.map((m) => (
            <button
              key={m.id}
              onClick={() => onChange(m.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] transition-all border ${
                value === m.id
                  ? "border-sys-blue bg-sys-blue/6 text-label"
                  : "border-separator bg-fill-secondary/40 text-label-secondary hover:bg-fill-secondary"
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
      </div>

      <div>
        <p className="text-[12px] font-medium text-label-tertiary mb-2 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-sys-orange inline-block" />
          {vi.set_provider_anthropic}
        </p>
        <div className="space-y-1.5">
          {ANTHROPIC_MODELS.map((m) => (
            <button
              key={m.id}
              onClick={() => onChange(m.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] transition-all border ${
                value === m.id
                  ? "border-sys-orange bg-sys-orange/6 text-label"
                  : "border-separator bg-fill-secondary/40 text-label-secondary hover:bg-fill-secondary"
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
    </div>
  );
}

export function SettingsPage() {
  const {
    googleApiKey, setGoogleApiKey,
    anthropicApiKey, setAnthropicApiKey,
    titleModel, setTitleModel,
    textModel, setTextModel,
  } = useSettingsStore();

  return (
    <div className="flex-1 overflow-y-auto bg-sys-bg">
      <div className="max-w-4xl mx-auto px-10 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[24px] font-semibold text-label tracking-tight">{vi.set_title}</h1>
          <p className="text-[14px] text-label-secondary mt-1">{vi.set_subtitle}</p>
        </div>

        {/* 2-column grid */}
        <div className="grid grid-cols-2 gap-6">

          {/* ─── Col 1: API Keys ─── */}
          <div className="apple-card p-6 space-y-6">
            <div>
              <h2 className="text-[15px] font-semibold text-label mb-1">{vi.set_keys_title}</h2>
              <p className="text-[13px] text-label-tertiary">Lưu tự động, không gửi lên server</p>
            </div>

            <ApiKeyInput
              label={vi.set_google_key}
              value={googleApiKey}
              onChange={setGoogleApiKey}
              placeholder={vi.set_google_key_ph}
            />

            <div className="h-px bg-separator" />

            <ApiKeyInput
              label={vi.set_anthropic_key}
              value={anthropicApiKey}
              onChange={setAnthropicApiKey}
              placeholder={vi.set_anthropic_key_ph}
            />

            <div className="h-px bg-separator" />

            {/* Thumbnail model — locked */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-label block">
                {vi.set_thumb_model}
              </label>
              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-separator bg-fill-tertiary">
                <span className="text-[12px] font-mono text-label-secondary">{THUMBNAIL_MODEL}</span>
                <Lock className="w-3.5 h-3.5 text-label-quaternary" />
              </div>
              <p className="text-[12px] text-label-tertiary">{vi.set_thumb_model_locked}</p>
            </div>
          </div>

          {/* ─── Col 2: Models ─── */}
          <div className="apple-card p-6 space-y-6">
            <div>
              <h2 className="text-[15px] font-semibold text-label mb-1">{vi.set_models_title}</h2>
              <p className="text-[13px] text-label-tertiary">Chọn model cho từng tính năng</p>
            </div>

            <ModelGroup
              label={vi.set_title_model}
              value={titleModel}
              onChange={setTitleModel}
            />

            <div className="h-px bg-separator" />

            <ModelGroup
              label={vi.set_text_model}
              value={textModel}
              onChange={setTextModel}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
