"use client";

import { Loader2, Wand2, Code2, Zap, SlidersHorizontal } from "lucide-react";
import { useThumbnailStore } from "@/store/thumbnail-store";
import { buildPrompt } from "@/lib/build-prompt";
import { Step1Context } from "./step1-context";
import { Step2Hook } from "./step2-hook";
import { Step3Visual } from "./step3-visual";
import { Step4Layout } from "./step4-layout";
import { Step5Character } from "./step5-character";
import { Step6Text } from "./step6-text";
import { Step7Colors } from "./step7-colors";
import { Step8Style } from "./step8-style";
import { vi } from "@/lib/vi";

export function StudioPanel() {
  const {
    step1,
    step2,
    step3,
    step4,
    step5,
    step6,
    step7,
    step8,
    studioMode,
    setStudioMode,
    stylePresets,
    isGenerating,
    setIsGenerating,
    setGeneratedImageUrl,
    setGeneratedPrompt,
    addToGallery,
  } = useThumbnailStore();

  const isQuick = studioMode === "quick";

  const selectedPreset = step8.customStyleId
    ? stylePresets.find((p) => p.id === step8.customStyleId)
    : null;

  const handlePreviewPrompt = () => {
    const prompt = buildPrompt({
      step1, step2, step3, step4, step5, step6, step7, step8,
      customStyleAnalysis: selectedPreset?.analysis,
    });
    setGeneratedPrompt(prompt);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step1, step2, step3, step4, step5, step6, step7, step8,
          customStyleAnalysis: selectedPreset?.analysis,
        }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
        setGeneratedPrompt(data.prompt || null);
        addToGallery({
          id: crypto.randomUUID(),
          imageUrl: data.imageUrl,
          prompt: data.prompt || "",
          createdAt: new Date().toISOString(),
          steps: { step1, step2, step3, step4, step5, step6, step7, step8 },
        });
      }
    } catch (err) {
      console.error("Generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Mode toggle */}
      <div className="px-6 pt-5 pb-2">
        <div className="flex rounded-xl bg-fill-tertiary p-1 gap-1">
          <button
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-[10px] py-2 text-[13px] font-medium transition-all ${
              isQuick
                ? "bg-white shadow-sm text-label"
                : "text-label-secondary hover:text-label"
            }`}
            onClick={() => setStudioMode("quick")}
          >
            <Zap className="w-3.5 h-3.5" />
            {vi.mode_quick}
          </button>
          <button
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-[10px] py-2 text-[13px] font-medium transition-all ${
              !isQuick
                ? "bg-white shadow-sm text-label"
                : "text-label-secondary hover:text-label"
            }`}
            onClick={() => setStudioMode("full")}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {vi.mode_full}
          </button>
        </div>
        <p className="text-[11px] text-label-tertiary text-center mt-1.5">
          {isQuick ? vi.mode_quick_desc : vi.mode_full_desc}
        </p>
      </div>

      {/* Steps */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="space-y-8">
          {/* Always show: Step 1 — Context */}
          <Step1Context />

          {!isQuick && (
            <>
              <div className="h-px bg-separator" />
              <Step2Hook />
              <div className="h-px bg-separator" />
              <Step3Visual />
              <div className="h-px bg-separator" />
              <Step4Layout />
            </>
          )}

          {/* Always show: Step 5 — Character */}
          <div className="h-px bg-separator" />
          <Step5Character />

          {/* Always show: Step 6 — Text */}
          <div className="h-px bg-separator" />
          <Step6Text />

          {!isQuick && (
            <>
              <div className="h-px bg-separator" />
              <Step7Colors />
            </>
          )}

          {/* Always show: Step 8 — Style (preset selection) */}
          <div className="h-px bg-separator" />
          <Step8Style />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="p-6 pt-4 material-thick border-t border-separator">
        <div className="flex gap-3">
          <button
            className="apple-btn-secondary flex-1 text-[14px] !h-[44px]"
            onClick={handlePreviewPrompt}
          >
            <Code2 className="w-4 h-4 mr-1.5" />
            {vi.nav_preview_prompt}
          </button>
          <button
            className="apple-btn-primary flex-1 text-[14px] !h-[44px]"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                {vi.nav_generating}
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-1.5" />
                {vi.nav_generate}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
