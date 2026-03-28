"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, Check, Loader2, Save } from "lucide-react";
import {
  useSettingsStore,
  GEMINI_TEXT_MODELS,
  ANTHROPIC_MODELS,
  THUMBNAIL_MODEL,
} from "@/store/settings-store";
import { vi } from "@/lib/vi";

function ApiKeyInput({
  label,
  maskedValue,
  hasKey,
  onSave,
  placeholder,
  isSaving,
}: {
  label: string;
  maskedValue: string;
  hasKey: boolean;
  onSave: (key: string) => void;
  placeholder: string;
  isSaving: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [show, setShow] = useState(false);

  const handleSave = () => {
    if (draft.trim()) {
      onSave(draft.trim());
      setDraft("");
      setEditing(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="text-[13px] font-semibold text-label block">{label}</label>

      {editing ? (
        <div className="space-y-2">
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              className="apple-input w-full text-[13px] pr-12"
              placeholder={placeholder}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
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
          <div className="flex gap-2">
            <button
              className="apple-btn-primary !h-8 text-[12px] px-4 gap-1.5"
              onClick={handleSave}
              disabled={!draft.trim() || isSaving}
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Lưu
            </button>
            <button
              className="apple-btn-secondary !h-8 text-[12px] px-4"
              onClick={() => { setEditing(false); setDraft(""); }}
            >
              Hủy
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex-1 px-3.5 py-2.5 rounded-xl border border-separator bg-fill-tertiary">
            <span className="text-[13px] font-mono text-label-secondary">
              {hasKey ? maskedValue : "Chưa nhập"}
            </span>
          </div>
          <button
            className="apple-btn-secondary !h-9 text-[12px] px-4"
            onClick={() => setEditing(true)}
          >
            {hasKey ? "Đổi" : "Nhập"}
          </button>
        </div>
      )}

      {hasKey && !editing && (
        <p className="text-[12px] text-sys-green flex items-center gap-1">
          <Check className="w-3 h-3" /> Key được lưu an toàn trên server
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
  const { titleModel, setTitleModel, textModel, setTextModel } = useSettingsStore();

  const [maskedGoogle, setMaskedGoogle] = useState("");
  const [maskedAnthropic, setMaskedAnthropic] = useState("");
  const [hasGoogle, setHasGoogle] = useState(false);
  const [hasAnthropic, setHasAnthropic] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load current key status from server
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setMaskedGoogle(data.googleApiKey || "");
        setMaskedAnthropic(data.anthropicApiKey || "");
        setHasGoogle(data.hasGoogle);
        setHasAnthropic(data.hasAnthropic);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSaveKey = async (field: "googleApiKey" | "anthropicApiKey", value: string) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      const data = await res.json();
      setMaskedGoogle(data.googleApiKey || "");
      setMaskedAnthropic(data.anthropicApiKey || "");
      setHasGoogle(data.hasGoogle);
      setHasAnthropic(data.hasAnthropic);
    } catch (err) {
      console.error("Failed to save key:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-label-tertiary" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-sys-bg">
      <div className="max-w-4xl mx-auto px-10 py-10">

        <div className="mb-8">
          <h1 className="text-[24px] font-semibold text-label tracking-tight">{vi.set_title}</h1>
          <p className="text-[14px] text-label-secondary mt-1">{vi.set_subtitle}</p>
        </div>

        <div className="grid grid-cols-2 gap-6">

          {/* ─── Col 1: API Keys ─── */}
          <div className="apple-card p-6 space-y-6">
            <div>
              <h2 className="text-[15px] font-semibold text-label mb-1">{vi.set_keys_title}</h2>
              <p className="text-[13px] text-label-tertiary">Key lưu trên server, không lộ ra trình duyệt</p>
            </div>

            <ApiKeyInput
              label={vi.set_google_key}
              maskedValue={maskedGoogle}
              hasKey={hasGoogle}
              onSave={(key) => handleSaveKey("googleApiKey", key)}
              placeholder={vi.set_google_key_ph}
              isSaving={isSaving}
            />

            <div className="h-px bg-separator" />

            <ApiKeyInput
              label={vi.set_anthropic_key}
              maskedValue={maskedAnthropic}
              hasKey={hasAnthropic}
              onSave={(key) => handleSaveKey("anthropicApiKey", key)}
              placeholder={vi.set_anthropic_key_ph}
              isSaving={isSaving}
            />

            <div className="h-px bg-separator" />

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
