"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { useThumbnailStore } from "@/store/thumbnail-store";
import { useSettingsStore } from "@/store/settings-store";
import { vi } from "@/lib/vi";

const audiences = [
  { value: "newbie", label: vi.s1_aud_newbie },
  { value: "intermediate", label: vi.s1_aud_intermediate },
  { value: "advanced", label: vi.s1_aud_advanced },
  { value: "general", label: vi.s1_aud_general },
];

export function Step1Context() {
  const { step1, setStep1 } = useThumbnailStore();
  const { textModel } = useSettingsStore();
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleAiSuggest = async () => {
    if (!step1.videoTopic && !step1.videoTitle) return;
    setIsSuggesting(true);
    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoTopic: step1.videoTopic, videoTitle: step1.videoTitle, settings: { textModel } }),
      });
      const data = await res.json();
      if (!data.error) {
        setStep1({
          ...(data.videoTopic && { videoTopic: data.videoTopic }),
          ...(data.videoTitle && { videoTitle: data.videoTitle }),
          ...(data.painPoint && { painPoint: data.painPoint }),
          ...(data.audience && { audience: data.audience }),
        });
      }
    } catch (err) {
      console.error("Suggest failed:", err);
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="step-number">1</div>
        <h3 className="text-[15px] font-semibold text-label tracking-tight">
          {vi.s1_title}
        </h3>
      </div>

      {/* Apple grouped list style */}
      <div className="apple-card">
        <div className="apple-row">
          <label className="text-[13px] font-medium text-label-secondary block mb-2">
            {vi.s1_topic}
          </label>
          <input
            type="text"
            className="apple-input w-full"
            placeholder={vi.s1_topic_ph}
            value={step1.videoTopic}
            onChange={(e) => setStep1({ videoTopic: e.target.value })}
          />
        </div>

        <div className="apple-row">
          <label className="text-[13px] font-medium text-label-secondary block mb-2">
            {vi.s1_video_title}
          </label>
          <textarea
            className="apple-textarea"
            placeholder={vi.s1_video_title_ph}
            rows={2}
            value={step1.videoTitle}
            onChange={(e) => setStep1({ videoTitle: e.target.value })}
          />
        </div>

        <div className="apple-row">
          <label className="text-[13px] font-medium text-label-secondary block mb-2">
            {vi.s1_audience}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {audiences.map((a) => (
              <button
                key={a.value}
                onClick={() =>
                  setStep1({ audience: a.value as typeof step1.audience })
                }
                className={`apple-pill text-[12px] justify-center ${
                  step1.audience === a.value
                    ? "apple-pill-active"
                    : "apple-pill-inactive"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <div className="apple-row">
          <label className="text-[13px] font-medium text-label-secondary block mb-2">
            {vi.s1_pain}
          </label>
          <input
            type="text"
            className="apple-input w-full"
            placeholder={vi.s1_pain_ph}
            value={step1.painPoint}
            onChange={(e) => setStep1({ painPoint: e.target.value })}
          />
        </div>
      </div>

      <button
        className="apple-btn-secondary w-full gap-2 text-[13px] !h-10"
        onClick={handleAiSuggest}
        disabled={isSuggesting || (!step1.videoTopic && !step1.videoTitle)}
        style={{ opacity: isSuggesting || (!step1.videoTopic && !step1.videoTitle) ? 0.4 : 1 }}
      >
        {isSuggesting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
        {isSuggesting ? "Đang gợi ý..." : vi.s1_ai_suggest}
      </button>
    </div>
  );
}
