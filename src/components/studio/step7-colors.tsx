"use client";

import { useThumbnailStore } from "@/store/thumbnail-store";
import { vi } from "@/lib/vi";

const swatches = ["#FF3B30", "#FF9500", "#FFCC00", "#34C759", "#007AFF", "#AF52DE", "#FF2D55", "#1C1C1E"];

export function Step7Colors() {
  const { step7, setStep7 } = useThumbnailStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="step-number">7</div>
        <h3 className="text-[15px] font-semibold text-label tracking-tight">
          {vi.s7_title}
        </h3>
      </div>

      {/* Primary color */}
      <div>
        <label className="text-[13px] font-medium text-label-secondary block mb-2.5 px-1">
          {vi.s7_primary}
        </label>
        <div className="apple-card">
          <div className="apple-row">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-11 h-11 rounded-xl shadow-apple-sm border border-black/5"
                style={{ backgroundColor: step7.primaryColor }}
              />
              <input
                type="text"
                className="apple-input flex-1 font-mono text-[14px]"
                value={step7.primaryColor}
                onChange={(e) => setStep7({ primaryColor: e.target.value })}
                maxLength={7}
              />
            </div>
            <div className="flex gap-2.5">
              {swatches.map((c) => (
                <button
                  key={c}
                  onClick={() => setStep7({ primaryColor: c })}
                  className="w-9 h-9 rounded-full transition-transform hover:scale-110 active:scale-95"
                  style={{
                    backgroundColor: c,
                    boxShadow:
                      step7.primaryColor === c
                        ? `0 0 0 2.5px #fff, 0 0 0 4.5px ${c}`
                        : "0 1px 2px rgba(0,0,0,0.1)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Toggles */}
      <div className="apple-card">
        <div className="apple-row flex items-center justify-between">
          <div>
            <p className="text-[15px] font-medium text-label">{vi.s7_drop_shadow}</p>
            <p className="text-[13px] text-label-tertiary mt-0.5">{vi.s7_drop_shadow_desc}</p>
          </div>
          <button
            onClick={() => setStep7({ dropShadow: !step7.dropShadow })}
            className="relative w-[51px] h-[31px] rounded-full transition-colors duration-200"
            style={{
              backgroundColor: step7.dropShadow ? "#34C759" : "rgba(120,120,128,0.16)",
            }}
          >
            <div
              className="absolute top-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-apple-sm transition-transform duration-200"
              style={{
                transform: step7.dropShadow ? "translateX(22px)" : "translateX(2px)",
              }}
            />
          </button>
        </div>
        <div className="apple-row flex items-center justify-between">
          <div>
            <p className="text-[15px] font-medium text-label">{vi.s7_high_contrast}</p>
            <p className="text-[13px] text-label-tertiary mt-0.5">{vi.s7_high_contrast_desc}</p>
          </div>
          <button
            onClick={() => setStep7({ highContrast: !step7.highContrast })}
            className="relative w-[51px] h-[31px] rounded-full transition-colors duration-200"
            style={{
              backgroundColor: step7.highContrast ? "#34C759" : "rgba(120,120,128,0.16)",
            }}
          >
            <div
              className="absolute top-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-apple-sm transition-transform duration-200"
              style={{
                transform: step7.highContrast ? "translateX(22px)" : "translateX(2px)",
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
