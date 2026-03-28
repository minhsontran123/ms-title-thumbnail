"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, Trash2, Plus, ImageIcon } from "lucide-react";
import { useThumbnailStore, type VisualStyle } from "@/store/thumbnail-store";
import { useSettingsStore } from "@/store/settings-store";
import { vi } from "@/lib/vi";

const styles: { value: VisualStyle; label: string; desc: string }[] = [
  { value: "youtube-viral", label: vi.s8_youtube_viral, desc: vi.s8_youtube_viral_desc },
  { value: "cinematic", label: vi.s8_cinematic, desc: vi.s8_cinematic_desc },
  { value: "minimalist", label: vi.s8_minimalist, desc: vi.s8_minimalist_desc },
  { value: "retro", label: vi.s8_retro, desc: vi.s8_retro_desc },
  { value: "dark-moody", label: vi.s8_dark_moody, desc: vi.s8_dark_moody_desc },
  { value: "colorful-pop", label: vi.s8_colorful_pop, desc: vi.s8_colorful_pop_desc },
  { value: "professional", label: vi.s8_professional, desc: vi.s8_professional_desc },
];

export function Step8Style() {
  const { step8, setStep8, studioMode, stylePresets, addStylePreset, removeStylePreset } =
    useThumbnailStore();
  const { googleApiKey } = useSettingsStore();

  const isQuick = studioMode === "quick";

  const [showAddForm, setShowAddForm] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const [channelName, setChannelName] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const handleAnalyze = async () => {
    if (!channelName || uploadedImages.length === 0) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/analyze-style", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: uploadedImages, channelName, settings: { googleApiKey } }),
      });
      const data = await res.json();
      if (data.analysis) {
        const preset = {
          id: crypto.randomUUID(),
          name: channelName,
          channelName,
          analysis: data.analysis,
          referenceImages: uploadedImages,
          createdAt: new Date().toISOString(),
        };
        addStylePreset(preset);
        setStep8({ customStyleId: preset.id });
        setShowAddForm(false);
        setChannelName("");
        setUploadedImages([]);
      }
    } catch (err) {
      console.error("Analyze failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="step-number">8</div>
        <h3 className="text-[15px] font-semibold text-label tracking-tight">
          {vi.s8_title}
        </h3>
      </div>

      {/* Built-in styles — only in full mode */}
      {!isQuick && (
        <div>
          <label className="text-[13px] font-medium text-label-secondary block mb-2.5 px-1">
            {vi.s8_style}
          </label>
          <div className="apple-card">
            {styles.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStep8({ visualStyle: opt.value, customStyleId: null })}
                className="apple-row w-full flex items-center justify-between text-left"
              >
                <div>
                  <p className="text-[15px] font-medium text-label">{opt.label}</p>
                  <p className="text-[13px] text-label-tertiary mt-0.5">{opt.desc}</p>
                </div>
                {step8.visualStyle === opt.value && !step8.customStyleId && (
                  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" className="flex-shrink-0 ml-3">
                    <path d="M1 6L5.5 10.5L15 1" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Style Library */}
      <div>
        <div className="flex items-center justify-between px-1 mb-2.5">
          <label className="text-[13px] font-medium text-label-secondary">
            {vi.sl_title}
          </label>
          <button
            className="apple-btn-plain text-[12px] gap-1 !px-2.5 !py-1 rounded-lg"
            onClick={() => {
              const next = !showAddForm;
              setShowAddForm(next);
              if (next) {
                setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
              }
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            {vi.sl_add}
          </button>
        </div>

        <p className="text-[12px] text-label-tertiary px-1 mb-3">{vi.sl_desc}</p>

        {/* Existing presets */}
        {stylePresets.length > 0 && (
          <div className="apple-card mb-4">
            {stylePresets.map((preset) => {
              const isSelected = step8.customStyleId === preset.id;
              return (
                <div key={preset.id} className="apple-row">
                  <div className="flex items-center justify-between">
                    <button
                      className="flex-1 text-left"
                      onClick={() =>
                        setStep8({
                          customStyleId: isSelected ? null : preset.id,
                        })
                      }
                    >
                      <p className="text-[15px] font-medium text-label">
                        {preset.channelName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[12px] text-label-tertiary">
                          {vi.sl_images(preset.referenceImages.length)}
                        </span>
                        {isSelected && (
                          <span className="text-[11px] font-semibold text-sys-blue">
                            {vi.sl_selected}
                          </span>
                        )}
                      </div>
                    </button>
                    <div className="flex items-center gap-1">
                      {/* Mini thumbnails */}
                      <div className="flex -space-x-2 mr-2">
                        {preset.referenceImages.slice(0, 3).map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt=""
                            className="w-8 h-5 object-cover rounded border border-white"
                          />
                        ))}
                      </div>
                      {isSelected && (
                        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" className="flex-shrink-0">
                          <path d="M1 6L5.5 10.5L15 1" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      <button
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-sys-red hover:bg-sys-red/8 transition-colors ml-1"
                        onClick={() => {
                          if (isSelected) setStep8({ customStyleId: null });
                          removeStylePreset(preset.id);
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add form */}
        {showAddForm && (
          <div ref={formRef} className="apple-card">
            <div className="apple-row">
              <label className="text-[13px] font-medium text-label-secondary block mb-2">
                {vi.sl_channel}
              </label>
              <input
                type="text"
                className="apple-input w-full"
                placeholder={vi.sl_channel_ph}
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
              />
            </div>

            <div className="apple-row">
              <label className="text-[13px] font-medium text-label-secondary block mb-2">
                {vi.sl_upload}
              </label>
              <p className="text-[12px] text-label-tertiary mb-3">{vi.sl_upload_desc}</p>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />

              {uploadedImages.length > 0 ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {uploadedImages.map((img, i) => (
                      <div key={i} className="relative">
                        <img src={img} alt="" className="w-full aspect-video object-cover rounded-lg" />
                        <button
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-sys-red text-white flex items-center justify-center text-[10px]"
                          onClick={() => setUploadedImages((prev) => prev.filter((_, idx) => idx !== i))}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {uploadedImages.length < 5 && (
                      <button
                        onClick={() => fileRef.current?.click()}
                        className="aspect-video rounded-lg border-2 border-dashed border-separator flex items-center justify-center hover:bg-fill-tertiary transition-colors"
                      >
                        <Plus className="w-5 h-5 text-label-quaternary" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full rounded-xl border-2 border-dashed border-separator p-6 text-center hover:bg-fill-tertiary transition-colors"
                >
                  <ImageIcon className="w-8 h-8 mx-auto text-label-quaternary mb-2" />
                  <span className="text-[12px] text-label-secondary">{vi.sl_upload_btn}</span>
                </button>
              )}
            </div>

            <div className="apple-row">
              <button
                className="apple-btn-primary w-full !h-10 text-[13px]"
                onClick={handleAnalyze}
                disabled={isAnalyzing || !channelName || uploadedImages.length === 0}
                style={{ opacity: isAnalyzing || !channelName || uploadedImages.length === 0 ? 0.4 : 1 }}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                    {vi.sl_analyzing}
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-1.5" />
                    {vi.sl_analyze}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
