"use client";

import { useRef } from "react";
import { Upload, ImageIcon } from "lucide-react";
import { useThumbnailStore, type TargetExpression } from "@/store/thumbnail-store";
import { vi } from "@/lib/vi";

const expressions: { value: TargetExpression; label: string }[] = [
  { value: "original", label: vi.s5_original },
  { value: "shocked", label: vi.s5_shocked },
  { value: "happy", label: vi.s5_happy },
  { value: "angry", label: vi.s5_angry },
  { value: "sad", label: vi.s5_sad },
  { value: "confused", label: vi.s5_confused },
  { value: "excited", label: vi.s5_excited },
];

export function Step5Character() {
  const { step5, setStep5 } = useThumbnailStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setStep5({ characterImage: reader.result as string, characterEnabled: true });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="step-number">5</div>
        <h3 className="text-[15px] font-semibold text-label tracking-tight">
          {vi.s5_title}
        </h3>
      </div>

      {/* Toggle */}
      <div className="apple-card">
        <div className="apple-row flex items-center justify-between">
          <span className="text-[15px] font-medium text-label">{vi.s5_enable}</span>
          <button
            onClick={() => setStep5({ characterEnabled: !step5.characterEnabled })}
            className="relative w-[51px] h-[31px] rounded-full transition-colors duration-200"
            style={{
              backgroundColor: step5.characterEnabled ? "#34C759" : "rgba(120,120,128,0.16)",
            }}
          >
            <div
              className="absolute top-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-apple-sm transition-transform duration-200"
              style={{
                transform: step5.characterEnabled ? "translateX(22px)" : "translateX(2px)",
              }}
            />
          </button>
        </div>
      </div>

      {step5.characterEnabled && (
        <>
          {/* Upload area */}
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
            {step5.characterImage ? (
              <div className="apple-card overflow-hidden">
                <div className="relative">
                  <img
                    src={step5.characterImage}
                    alt=""
                    className="w-full aspect-square object-cover"
                  />
                  <button
                    className="absolute bottom-3 right-3 apple-btn-secondary !h-8 text-[12px] px-3 bg-white/90 backdrop-blur-sm"
                    onClick={() => fileRef.current?.click()}
                  >
                    {vi.s5_change}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full rounded-2xl border-2 border-dashed border-separator p-10 text-center hover:bg-fill-tertiary transition-colors"
              >
                <Upload className="w-10 h-10 mx-auto text-label-quaternary mb-3" />
                <p className="text-[13px] font-medium text-label-secondary">
                  {vi.s5_upload_desc}
                </p>
                <span className="inline-block mt-3 apple-btn-secondary !h-8 text-[12px] px-4">
                  {vi.s5_upload_btn}
                </span>
              </button>
            )}
          </div>

          {/* Expression selector */}
          <div>
            <label className="text-[13px] font-medium text-label-secondary block mb-2.5 px-1">
              {vi.s5_expression}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {expressions.map((exp) => (
                <button
                  key={exp.value}
                  onClick={() => setStep5({ targetExpression: exp.value })}
                  className={`apple-pill justify-center ${
                    step5.targetExpression === exp.value
                      ? "apple-pill-active"
                      : "apple-pill-inactive"
                  }`}
                >
                  {exp.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
