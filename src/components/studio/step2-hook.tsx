"use client";

import { useThumbnailStore, type EmotionalTrigger } from "@/store/thumbnail-store";
import { vi } from "@/lib/vi";

const triggers: { value: EmotionalTrigger; label: string; desc: string }[] = [
  { value: "shock", label: vi.s2_shock, desc: vi.s2_shock_desc },
  { value: "curiosity", label: vi.s2_curiosity, desc: vi.s2_curiosity_desc },
  { value: "fomo", label: vi.s2_fomo, desc: vi.s2_fomo_desc },
  { value: "inspiration", label: vi.s2_inspiration, desc: vi.s2_inspiration_desc },
  { value: "controversy", label: vi.s2_controversy, desc: vi.s2_controversy_desc },
];

export function Step2Hook() {
  const { step2, setStep2 } = useThumbnailStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="step-number">2</div>
        <h3 className="text-[15px] font-semibold text-label tracking-tight">
          {vi.s2_title}
        </h3>
      </div>

      <div className="apple-card">
        <div className="apple-row">
          <label className="text-[13px] font-medium text-label-secondary block mb-2">
            {vi.s2_problem}
          </label>
          <input
            type="text"
            className="apple-input w-full"
            placeholder={vi.s2_problem_ph}
            value={step2.currentProblem}
            onChange={(e) => setStep2({ currentProblem: e.target.value })}
          />
        </div>

        <div className="apple-row">
          <label className="text-[13px] font-medium text-label-secondary block mb-2">
            {vi.s2_result}
          </label>
          <input
            type="text"
            className="apple-input w-full"
            placeholder={vi.s2_result_ph}
            value={step2.desiredResult}
            onChange={(e) => setStep2({ desiredResult: e.target.value })}
          />
        </div>
      </div>

      {/* Emotional trigger — Apple list selection */}
      <div>
        <label className="text-[13px] font-medium text-label-secondary block mb-2 px-1">
          {vi.s2_trigger}
        </label>
        <div className="apple-card">
          {triggers.map((t) => (
            <button
              key={t.value}
              onClick={() => setStep2({ emotionalTrigger: t.value })}
              className="apple-row w-full flex items-center justify-between text-left"
            >
              <div>
                <p className="text-[15px] font-medium text-label">{t.label}</p>
                <p className="text-[13px] text-label-tertiary mt-0.5">{t.desc}</p>
              </div>
              {step2.emotionalTrigger === t.value && (
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" className="flex-shrink-0 ml-3">
                  <path d="M1 6L5.5 10.5L15 1" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Desire Loop — subtle card */}
      <div className="rounded-xl bg-fill-tertiary p-4">
        <p className="text-[11px] font-semibold text-label-tertiary mb-3">
          {vi.s2_desire_loop}
        </p>
        <div className="flex items-center gap-2 text-[13px] font-medium flex-wrap">
          <span className="px-2.5 py-1 rounded-lg bg-sys-red/10 text-sys-red">
            {step2.currentProblem || vi.s2_problem}
          </span>
          <span className="text-label-quaternary text-[11px]">→</span>
          <span className="px-2.5 py-1 rounded-lg bg-sys-orange/10 text-sys-orange">
            {step2.emotionalTrigger}
          </span>
          <span className="text-label-quaternary text-[11px]">→</span>
          <span className="px-2.5 py-1 rounded-lg bg-sys-green/10 text-sys-green">
            {step2.desiredResult || vi.s2_result}
          </span>
        </div>
      </div>
    </div>
  );
}
