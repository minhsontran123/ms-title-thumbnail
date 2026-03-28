"use client";

import {
  Sparkles,
  Loader2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  RefreshCw,
  Type,
} from "lucide-react";
import { useState } from "react";
import { useThumbnailStore, type TitleVariant } from "@/store/thumbnail-store";
import { vi } from "@/lib/vi";

const FORMULA_COLOR: Record<string, string> = {
  loss_number: "bg-red-50 text-red-600",
  warning: "bg-orange-50 text-orange-600",
  secret: "bg-purple-50 text-purple-600",
  journey: "bg-blue-50 text-blue-600",
  result: "bg-green-50 text-green-600",
  question: "bg-yellow-50 text-yellow-700",
  comparison: "bg-cyan-50 text-cyan-600",
  controversy: "bg-pink-50 text-pink-600",
  mistake: "bg-rose-50 text-rose-600",
  how_to: "bg-indigo-50 text-indigo-600",
  exclusive: "bg-violet-50 text-violet-600",
  beginner: "bg-teal-50 text-teal-600",
};

const AUDIENCE_OPTIONS = [
  { value: "general", label: "Tất cả" },
  { value: "newbie", label: "Người mới" },
  { value: "intermediate", label: "Có kinh nghiệm" },
  { value: "advanced", label: "Chuyên gia" },
];

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color =
    value >= 80 ? "bg-sys-green" : value >= 60 ? "bg-sys-blue" : "bg-sys-orange";
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-label-tertiary w-20 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-fill-tertiary overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-[11px] font-semibold text-label-secondary w-6 text-right">
        {value}
      </span>
    </div>
  );
}

function TitleCard({
  variant,
  isSelected,
  onSelect,
}: {
  variant: TitleVariant;
  isSelected: boolean;
  onSelect: (v: TitleVariant) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const formulaClass = FORMULA_COLOR[variant.formulaKey] ?? "bg-fill-secondary text-label-secondary";
  const charCount = variant.title.length;
  const charOk = charCount <= 70;

  return (
    <div
      className={`apple-card p-4 transition-all ${
        isSelected ? "ring-2 ring-sys-blue ring-offset-1" : ""
      }`}
    >
      {/* Header row */}
      <div className="flex items-start gap-3">
        {/* Score circle */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-[13px] font-bold ${
            variant.score >= 90
              ? "bg-sys-green/10 text-sys-green"
              : variant.score >= 75
              ? "bg-sys-blue/10 text-sys-blue"
              : "bg-fill-secondary text-label-secondary"
          }`}
        >
          {variant.score}
        </div>

        {/* Title + formula */}
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-medium text-label leading-snug">{variant.title}</p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${formulaClass}`}>
              {variant.formula}
            </span>
            <span className={`text-[11px] ${charOk ? "text-label-tertiary" : "text-sys-red"}`}>
              {vi.ts_char_count(charCount)}
            </span>
          </div>
        </div>
      </div>

      {/* Expand details */}
      <button
        className="w-full flex items-center justify-between mt-3 pt-3 border-t border-separator text-[12px] text-label-tertiary hover:text-label transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <span>Xem phân tích</span>
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {expanded && (
        <div className="mt-3 space-y-2">
          <ScoreBar label={vi.ts_score_emotion} value={variant.scores.emotion} />
          <ScoreBar label={vi.ts_score_clarity} value={variant.scores.clarity} />
          <ScoreBar label={vi.ts_score_curiosity} value={variant.scores.curiosity} />
          <ScoreBar label={vi.ts_score_power} value={variant.scores.powerWords} />
          <ScoreBar label={vi.ts_score_seo} value={variant.scores.seo} />
          <div className="pt-2 flex items-center gap-2">
            <span className="text-[11px] text-label-tertiary">Chữ thumbnail gợi ý:</span>
            <span className="px-2 py-0.5 rounded-md bg-fill-secondary text-[12px] font-semibold text-label">
              {variant.suggestedTextOverlay}
            </span>
          </div>
        </div>
      )}

      {/* Action button */}
      <button
        className={`w-full mt-3 h-9 rounded-xl text-[13px] font-medium flex items-center justify-center gap-1.5 transition-all ${
          isSelected
            ? "bg-sys-green/10 text-sys-green"
            : "apple-btn-primary"
        }`}
        onClick={() => onSelect(variant)}
        disabled={isSelected}
      >
        {isSelected ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            {vi.ts_used}
          </>
        ) : (
          <>
            {vi.ts_use_title}
            <ArrowRight className="w-3.5 h-3.5" />
          </>
        )}
      </button>
    </div>
  );
}

export function TitlePanel() {
  const {
    titleTopic,
    setTitleTopic,
    titleAudience,
    setTitleAudience,
    generatedTitles,
    setGeneratedTitles,
    selectedTitle,
    setSelectedTitle,
    isTitleGenerating,
    setIsTitleGenerating,
    setActiveTab,
    setStep1,
    setStep2,
    setStep6,
    setStep7,
  } = useThumbnailStore();

  const handleGenerate = async () => {
    if (!titleTopic.trim()) return;
    setIsTitleGenerating(true);
    try {
      const res = await fetch("/api/title", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: titleTopic, audience: titleAudience }),
      });
      const data = await res.json();
      if (data.titles) {
        // Sort by score descending
        const sorted = [...data.titles].sort(
          (a: TitleVariant, b: TitleVariant) => b.score - a.score
        );
        setGeneratedTitles(sorted);
      }
    } catch (err) {
      console.error("Title generation failed:", err);
    } finally {
      setIsTitleGenerating(false);
    }
  };

  const handleSelectTitle = (variant: TitleVariant) => {
    setSelectedTitle(variant);
    // Auto-fill thumbnail studio
    setStep1({ videoTitle: variant.title, videoTopic: titleTopic });
    setStep2({ emotionalTrigger: variant.suggestedEmotionalTrigger });
    setStep6({ textOverlay: variant.suggestedTextOverlay });
    setStep7({ primaryColor: variant.suggestedPrimaryColor });
  };

  const handleGoToThumbnail = () => {
    setActiveTab("thumbnail");
  };

  const canGenerate = titleTopic.trim().length > 0 && !isTitleGenerating;

  return (
    <div className="flex flex-col h-full">
      {/* Input section */}
      <div className="px-6 pt-5 pb-4 space-y-4">
        {/* Topic */}
        <div>
          <label className="text-[12px] font-semibold text-label-secondary uppercase tracking-wide block mb-1.5">
            {vi.ts_topic}
          </label>
          <textarea
            className="apple-input w-full text-[13px] resize-none leading-relaxed"
            rows={3}
            placeholder={vi.ts_topic_ph}
            value={titleTopic}
            onChange={(e) => setTitleTopic(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate();
            }}
          />
        </div>

        {/* Audience */}
        <div>
          <label className="text-[12px] font-semibold text-label-secondary uppercase tracking-wide block mb-1.5">
            {vi.ts_audience}
          </label>
          <div className="flex gap-2 flex-wrap">
            {AUDIENCE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTitleAudience(opt.value as typeof titleAudience)}
                className={`px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all ${
                  titleAudience === opt.value
                    ? "bg-sys-blue text-white"
                    : "bg-fill-secondary text-label-secondary hover:bg-fill-primary"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <button
          className="apple-btn-primary w-full !h-[44px] text-[14px] gap-2"
          onClick={handleGenerate}
          disabled={!canGenerate}
          style={{ opacity: canGenerate ? 1 : 0.35 }}
        >
          {isTitleGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {vi.ts_generating}
            </>
          ) : generatedTitles.length > 0 ? (
            <>
              <RefreshCw className="w-4 h-4" />
              {vi.ts_regenerate}
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              {vi.ts_generate}
            </>
          )}
        </button>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {isTitleGenerating ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sys-blue/10 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-sys-blue animate-spin" />
            </div>
            <p className="text-[14px] font-medium text-label">Đang phân tích & tạo title...</p>
            <p className="text-[12px] text-label-tertiary">AI đang áp dụng 12 công thức proven</p>
          </div>
        ) : generatedTitles.length > 0 ? (
          <>
            {/* Count + selected title banner */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-[12px] font-semibold text-label-tertiary uppercase tracking-wide">
                {vi.ts_results(generatedTitles.length)}
              </p>
              {selectedTitle && (
                <button
                  className="flex items-center gap-1 text-[12px] font-semibold text-sys-blue hover:opacity-75 transition-opacity"
                  onClick={handleGoToThumbnail}
                >
                  {vi.ts_goto_thumbnail}
                </button>
              )}
            </div>

            {/* Selected title summary */}
            {selectedTitle && (
              <div className="mb-4 p-3.5 rounded-2xl bg-sys-blue/6 border border-sys-blue/20">
                <p className="text-[11px] font-semibold text-sys-blue uppercase tracking-wide mb-1">
                  {vi.ts_selected_title}
                </p>
                <p className="text-[13px] font-medium text-label leading-snug">
                  {selectedTitle.title}
                </p>
                <button
                  className="mt-2.5 flex items-center gap-1.5 text-[12px] font-semibold text-sys-blue"
                  onClick={handleGoToThumbnail}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  {vi.ts_goto_thumbnail}
                </button>
              </div>
            )}

            <div className="space-y-3">
              {generatedTitles.map((variant) => (
                <TitleCard
                  key={variant.id}
                  variant={variant}
                  isSelected={selectedTitle?.id === variant.id}
                  onSelect={handleSelectTitle}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-fill-secondary flex items-center justify-center">
              <Type className="w-6 h-6 text-label-quaternary" strokeWidth={1.5} />
            </div>
            <p className="text-[14px] font-semibold text-label">{vi.ts_empty_title}</p>
            <p className="text-[13px] text-label-tertiary max-w-[240px] leading-relaxed">
              {vi.ts_empty_desc}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
