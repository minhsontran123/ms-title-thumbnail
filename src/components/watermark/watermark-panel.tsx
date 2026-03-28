"use client";

import { useRef } from "react";
import { Droplets, Upload, ImageIcon } from "lucide-react";
import {
  useThumbnailStore,
  type WatermarkPreset,
  type WatermarkType,
  type WatermarkPosition,
  type WatermarkColorMode,
  type WatermarkPlatform,
} from "@/store/thumbnail-store";
import { vi } from "@/lib/vi";

const presets: { value: WatermarkPreset; label: string; desc: string }[] = [
  { value: "branding", label: vi.wm_preset_branding, desc: vi.wm_preset_branding_desc },
  { value: "anti-repost", label: vi.wm_preset_anti_repost, desc: vi.wm_preset_anti_repost_desc },
  { value: "educational", label: vi.wm_preset_educational, desc: vi.wm_preset_educational_desc },
];

const types: { value: WatermarkType; label: string }[] = [
  { value: "subtle-text", label: vi.wm_type_subtle },
  { value: "bold-text", label: vi.wm_type_bold },
  { value: "image", label: vi.wm_type_image },
];

const positions: { value: WatermarkPosition; label: string }[] = [
  { value: "top-left", label: vi.wm_pos_tl },
  { value: "top-right", label: vi.wm_pos_tr },
  { value: "bottom-left", label: vi.wm_pos_bl },
  { value: "bottom-right", label: vi.wm_pos_br },
  { value: "center", label: vi.wm_pos_center },
  { value: "auto-smart", label: vi.wm_pos_auto },
];

const colorModes: { value: WatermarkColorMode; label: string }[] = [
  { value: "adaptive", label: vi.wm_color_adaptive },
  { value: "light", label: vi.wm_color_light },
  { value: "dark", label: vi.wm_color_dark },
];

const platforms: { value: WatermarkPlatform; label: string }[] = [
  { value: "youtube", label: vi.wm_plat_youtube },
  { value: "instagram", label: vi.wm_plat_instagram },
  { value: "tiktok", label: vi.wm_plat_tiktok },
  { value: "general", label: vi.wm_plat_general },
];

function applyPreset(preset: WatermarkPreset) {
  switch (preset) {
    case "branding":
      return { type: "bold-text" as WatermarkType, position: "bottom-right" as WatermarkPosition, opacity: 15, repeatPattern: false };
    case "anti-repost":
      return { type: "subtle-text" as WatermarkType, position: "center" as WatermarkPosition, opacity: 5, repeatPattern: true, rotation: -30 };
    case "educational":
      return { type: "subtle-text" as WatermarkType, position: "bottom-left" as WatermarkPosition, opacity: 8, repeatPattern: false };
  }
}

export function WatermarkPanel() {
  const { watermark, setWatermark } = useThumbnailStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setWatermark({ uploadedImage: reader.result as string, type: "image" });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-4 pb-3">
        <h3 className="text-[15px] font-semibold text-label tracking-tight flex items-center gap-2.5">
          <Droplets className="w-[18px] h-[18px] text-sys-blue" />
          {vi.wm_title}
        </h3>
        <p className="text-[13px] text-label-tertiary mt-1">{vi.wm_desc}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-5">
        {/* Presets */}
        <div>
          <label className="text-[13px] font-medium text-label-secondary block mb-2.5 px-1">
            {vi.wm_preset}
          </label>
          <div className="apple-card">
            {presets.map((p) => (
              <button
                key={p.value}
                onClick={() => {
                  setWatermark({ preset: p.value, ...applyPreset(p.value) });
                }}
                className="apple-row w-full flex items-center justify-between text-left"
              >
                <div>
                  <p className="text-[15px] font-medium text-label">{p.label}</p>
                  <p className="text-[13px] text-label-tertiary mt-0.5">{p.desc}</p>
                </div>
                {watermark.preset === p.value && (
                  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" className="flex-shrink-0 ml-3">
                    <path d="M1 6L5.5 10.5L15 1" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="text-[13px] font-medium text-label-secondary block mb-2.5 px-1">
            {vi.wm_type}
          </label>
          <div className="flex gap-2">
            {types.map((t) => (
              <button
                key={t.value}
                onClick={() => setWatermark({ type: t.value, preset: null })}
                className={`apple-pill flex-1 justify-center ${
                  watermark.type === t.value ? "apple-pill-active" : "apple-pill-inactive"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text or Image input */}
        {watermark.type === "image" ? (
          <div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            {watermark.uploadedImage ? (
              <div className="apple-card overflow-hidden">
                <div className="relative p-4 flex items-center gap-4">
                  <img src={watermark.uploadedImage} alt="" className="w-16 h-16 object-contain rounded-lg bg-fill-tertiary" />
                  <button
                    className="apple-btn-secondary !h-8 text-[12px] px-3"
                    onClick={() => fileRef.current?.click()}
                  >
                    {vi.wm_upload}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full rounded-2xl border-2 border-dashed border-separator p-8 text-center hover:bg-fill-tertiary transition-colors"
              >
                <ImageIcon className="w-8 h-8 mx-auto text-label-quaternary mb-2" />
                <p className="text-[13px] text-label-secondary">{vi.wm_upload}</p>
              </button>
            )}
          </div>
        ) : (
          <div className="apple-card">
            <div className="apple-row">
              <label className="text-[13px] font-medium text-label-secondary block mb-2">
                {vi.wm_text}
              </label>
              <input
                type="text"
                className="apple-input w-full"
                placeholder={vi.wm_text_ph}
                value={watermark.text}
                onChange={(e) => setWatermark({ text: e.target.value, preset: null })}
              />
            </div>
          </div>
        )}

        {/* Position */}
        <div>
          <label className="text-[13px] font-medium text-label-secondary block mb-2.5 px-1">
            {vi.wm_position}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {positions.map((p) => (
              <button
                key={p.value}
                onClick={() => setWatermark({ position: p.value, preset: null })}
                className={`apple-pill justify-center text-[12px] ${
                  watermark.position === p.value ? "apple-pill-active" : "apple-pill-inactive"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Color Mode */}
        <div>
          <label className="text-[13px] font-medium text-label-secondary block mb-2.5 px-1">
            {vi.wm_color_mode}
          </label>
          <div className="flex gap-2">
            {colorModes.map((m) => (
              <button
                key={m.value}
                onClick={() => setWatermark({ colorMode: m.value })}
                className={`apple-pill flex-1 justify-center ${
                  watermark.colorMode === m.value ? "apple-pill-active" : "apple-pill-inactive"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Platform */}
        <div>
          <label className="text-[13px] font-medium text-label-secondary block mb-2.5 px-1">
            {vi.wm_platform}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {platforms.map((p) => (
              <button
                key={p.value}
                onClick={() => setWatermark({ platform: p.value })}
                className={`apple-pill justify-center ${
                  watermark.platform === p.value ? "apple-pill-active" : "apple-pill-inactive"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders: Opacity, Text Size, Rotation */}
        <div className="apple-card">
          <div className="apple-row">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[13px] font-medium text-label-secondary">{vi.wm_opacity}</label>
              <span className="text-[13px] text-label-tertiary tabular-nums">{watermark.opacity}%</span>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              value={watermark.opacity}
              onChange={(e) => setWatermark({ opacity: Number(e.target.value), preset: null })}
              className="w-full accent-sys-blue"
            />
          </div>
          <div className="apple-row">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[13px] font-medium text-label-secondary">{vi.wm_text_size}</label>
              <span className="text-[13px] text-label-tertiary tabular-nums">{watermark.textSize}px</span>
            </div>
            <input
              type="range"
              min={10}
              max={120}
              value={watermark.textSize}
              onChange={(e) => setWatermark({ textSize: Number(e.target.value), preset: null })}
              className="w-full accent-sys-blue"
            />
          </div>
          <div className="apple-row">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[13px] font-medium text-label-secondary">{vi.wm_rotation}</label>
              <span className="text-[13px] text-label-tertiary tabular-nums">{watermark.rotation}°</span>
            </div>
            <input
              type="range"
              min={-180}
              max={180}
              value={watermark.rotation}
              onChange={(e) => setWatermark({ rotation: Number(e.target.value), preset: null })}
              className="w-full accent-sys-blue"
            />
          </div>
        </div>

        {/* Toggles: Avoid Faces, Repeat Pattern */}
        <div className="apple-card">
          <div className="apple-row flex items-center justify-between">
            <div>
              <p className="text-[15px] font-medium text-label">{vi.wm_avoid_faces}</p>
              <p className="text-[13px] text-label-tertiary mt-0.5">{vi.wm_avoid_faces_desc}</p>
            </div>
            <button
              onClick={() => setWatermark({ avoidFaces: !watermark.avoidFaces })}
              className="relative w-[51px] h-[31px] rounded-full transition-colors duration-200 flex-shrink-0"
              style={{
                backgroundColor: watermark.avoidFaces ? "#34C759" : "rgba(120,120,128,0.16)",
              }}
            >
              <div
                className="absolute top-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-apple-sm transition-transform duration-200"
                style={{
                  transform: watermark.avoidFaces ? "translateX(22px)" : "translateX(2px)",
                }}
              />
            </button>
          </div>
          <div className="apple-row flex items-center justify-between">
            <div>
              <p className="text-[15px] font-medium text-label">{vi.wm_repeat}</p>
              <p className="text-[13px] text-label-tertiary mt-0.5">{vi.wm_repeat_desc}</p>
            </div>
            <button
              onClick={() => setWatermark({ repeatPattern: !watermark.repeatPattern, preset: null })}
              className="relative w-[51px] h-[31px] rounded-full transition-colors duration-200 flex-shrink-0"
              style={{
                backgroundColor: watermark.repeatPattern ? "#34C759" : "rgba(120,120,128,0.16)",
              }}
            >
              <div
                className="absolute top-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-apple-sm transition-transform duration-200"
                style={{
                  transform: watermark.repeatPattern ? "translateX(22px)" : "translateX(2px)",
                }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="p-6 pt-4 material-thick border-t border-separator">
        <button className="apple-btn-primary w-full">
          <Droplets className="w-4 h-4 mr-1.5" />
          {vi.wm_apply}
        </button>
      </div>
    </div>
  );
}
