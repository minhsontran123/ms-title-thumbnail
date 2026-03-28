"use client";

import { useThumbnailStore, type TextStyle, type TextGoal } from "@/store/thumbnail-store";
import { vi } from "@/lib/vi";

const textStyles: { value: TextStyle; label: string; sample: string; cls: string }[] = [
  { value: "big-bold", label: vi.s6_big_bold, sample: "ABC", cls: "text-[20px] font-black tracking-tight" },
  { value: "minimal", label: vi.s6_minimal, sample: "abc", cls: "text-[18px] font-light tracking-wide" },
  { value: "handwritten", label: vi.s6_handwritten, sample: "Abc", cls: "text-[18px] font-medium italic" },
  { value: "neon", label: vi.s6_neon, sample: "ABC", cls: "text-[20px] font-bold" },
];

const textGoals: { value: TextGoal; label: string }[] = [
  { value: "curiosity", label: vi.s6_curiosity },
  { value: "urgency", label: vi.s6_urgency },
  { value: "value", label: vi.s6_value },
  { value: "controversy", label: vi.s6_controversy },
  { value: "emotion", label: vi.s6_emotion },
];

export function Step6Text() {
  const { step6, setStep6 } = useThumbnailStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="step-number">6</div>
        <h3 className="text-[15px] font-semibold text-label tracking-tight">
          {vi.s6_title}
        </h3>
      </div>

      {/* Text input */}
      <div className="apple-card">
        <div className="apple-row">
          <div className="flex items-baseline justify-between mb-2">
            <label className="text-[13px] font-medium text-label-secondary">
              {vi.s6_text}
            </label>
            <span className="text-[11px] text-label-tertiary">{vi.s6_text_hint}</span>
          </div>
          <input
            type="text"
            className="apple-input w-full text-[17px] font-semibold !h-11"
            placeholder={vi.s6_text_ph}
            value={step6.textOverlay}
            onChange={(e) => setStep6({ textOverlay: e.target.value })}
            maxLength={50}
          />
        </div>
      </div>

      {/* Text style — visual cards */}
      <div>
        <label className="text-[13px] font-medium text-label-secondary block mb-2.5 px-1">
          {vi.s6_style}
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {textStyles.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStep6({ textStyle: opt.value })}
              className={`rounded-xl p-4 text-left transition-all ${
                step6.textStyle === opt.value
                  ? "bg-white shadow-apple ring-[1.5px] ring-sys-blue"
                  : "bg-fill-tertiary hover:bg-fill-secondary"
              }`}
            >
              <p
                className={`${opt.cls} mb-1.5 leading-none ${
                  opt.value === "neon" && step6.textStyle === opt.value
                    ? "text-sys-blue"
                    : "text-label"
                }`}
                style={
                  opt.value === "neon"
                    ? { textShadow: "0 0 8px rgba(0,122,255,0.4)" }
                    : undefined
                }
              >
                {opt.sample}
              </p>
              <p className="text-[11px] text-label-tertiary font-medium">
                {opt.label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Text goal pills */}
      <div>
        <label className="text-[13px] font-medium text-label-secondary block mb-2.5 px-1">
          {vi.s6_goal}
        </label>
        <div className="flex flex-wrap gap-2">
          {textGoals.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStep6({ textGoal: opt.value })}
              className={`apple-pill ${
                step6.textGoal === opt.value
                  ? "apple-pill-active"
                  : "apple-pill-inactive"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
