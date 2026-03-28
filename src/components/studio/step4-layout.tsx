"use client";

import { useThumbnailStore, type LayoutType } from "@/store/thumbnail-store";
import { vi } from "@/lib/vi";

const layoutOptions: { value: LayoutType; label: string; desc: string }[] = [
  { value: "symmetric", label: vi.s4_symmetric, desc: vi.s4_symmetric_desc },
  { value: "rule-of-thirds", label: vi.s4_thirds, desc: vi.s4_thirds_desc },
  { value: "ab-split", label: vi.s4_split, desc: vi.s4_split_desc },
];

export function Step4Layout() {
  const { step4, setStep4 } = useThumbnailStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="step-number">4</div>
        <h3 className="text-[15px] font-semibold text-label tracking-tight">
          {vi.s4_title}
        </h3>
      </div>

      <div>
        <label className="text-[13px] font-medium text-label-secondary block mb-2.5 px-1">
          {vi.s4_layout}
        </label>
        <div className="apple-card">
          {layoutOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStep4({ layout: opt.value })}
              className="apple-row w-full flex items-center justify-between text-left"
            >
              <div>
                <p className="text-[15px] font-medium text-label">{opt.label}</p>
                <p className="text-[13px] text-label-tertiary mt-0.5">{opt.desc}</p>
              </div>
              {step4.layout === opt.value && (
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" className="flex-shrink-0 ml-3">
                  <path d="M1 6L5.5 10.5L15 1" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
