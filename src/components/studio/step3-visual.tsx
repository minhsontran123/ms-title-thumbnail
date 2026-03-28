"use client";

import { useThumbnailStore, type VisualElement } from "@/store/thumbnail-store";
import { vi } from "@/lib/vi";

const visualOptions: { value: VisualElement; label: string }[] = [
  { value: "high-contrast", label: vi.s3_high_contrast },
  { value: "big-face", label: vi.s3_big_face },
  { value: "curiosity-graph", label: vi.s3_curiosity_graph },
  { value: "giant-text", label: vi.s3_giant_text },
  { value: "red-arrows", label: vi.s3_red_arrows },
  { value: "cinematic", label: vi.s3_cinematic },
  { value: "collage", label: vi.s3_collage },
];

export function Step3Visual() {
  const { step3, setStep3 } = useThumbnailStore();

  const toggleVisual = (v: VisualElement) => {
    const current = step3.visualElements;
    if (current.includes(v)) {
      setStep3({ visualElements: current.filter((x) => x !== v) });
    } else if (current.length < 3) {
      setStep3({ visualElements: [...current, v] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="step-number">3</div>
        <h3 className="text-[15px] font-semibold text-label tracking-tight">
          {vi.s3_title}
        </h3>
      </div>

      {/* Visual elements as pills */}
      <div>
        <div className="flex items-baseline justify-between px-1 mb-2.5">
          <label className="text-[13px] font-medium text-label-secondary">
            {vi.s3_elements}
          </label>
          <span className="text-[12px] text-label-tertiary tabular-nums">
            {step3.visualElements.length}/3
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {visualOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => toggleVisual(opt.value)}
              className={`apple-pill ${
                step3.visualElements.includes(opt.value)
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
