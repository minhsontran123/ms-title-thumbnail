"use client";

import {
  Download,
  Copy,
  ImageIcon,
  Loader2,
  FileText,
  Sparkles,
  Check,
  Code2,
} from "lucide-react";
import { useThumbnailStore } from "@/store/thumbnail-store";
import { useSettingsStore } from "@/store/settings-store";
import { vi } from "@/lib/vi";
import { useState } from "react";

export function Workspace() {
  const { googleApiKey, anthropicApiKey, textModel } = useSettingsStore();
  const {
    generatedImageUrl,
    generatedPrompt,
    isGenerating,
    step1,
    step2,
    watermark,
    socialLinks,
    setSocialLinks,
  } = useThumbnailStore();

  const [metadata, setMetadata] = useState<{
    title: string;
    description: string;
    tags: string[];
  } | null>(null);
  const [isGeneratingMeta, setIsGeneratingMeta] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleDownload = () => {
    if (!generatedImageUrl) return;
    const link = document.createElement("a");
    link.href = generatedImageUrl;
    link.download = `ms-thumbnail-${Date.now()}.png`;
    link.click();
  };

  const handleGenerateMetadata = async () => {
    setIsGeneratingMeta(true);
    try {
      const res = await fetch("/api/metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step1, step2, settings: { googleApiKey, anthropicApiKey, textModel } }),
      });
      const data = await res.json();
      setMetadata(data);
    } catch (err) {
      console.error("Metadata generation failed:", err);
    } finally {
      setIsGeneratingMeta(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const watermarkPositionClass = (() => {
    switch (watermark.position) {
      case "top-left": return "top-5 left-5";
      case "top-right": return "top-5 right-5";
      case "bottom-left": return "bottom-5 left-5";
      case "bottom-right": return "bottom-5 right-5";
      case "center":
      case "auto-smart":
      default: return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
    }
  })();

  const watermarkColor = watermark.colorMode === "dark" ? "#000" : "#fff";

  return (
    <div className="flex-1 flex flex-col h-full bg-sys-bg">
      {/* ─── Toolbar — frosted glass ─── */}
      <div className="material-thick border-b border-separator px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-semibold text-label tracking-tight">
              {vi.ws_title}
            </h2>
            <p className="text-[12px] text-label-tertiary mt-0.5">
              {vi.ws_size}
            </p>
          </div>
          {generatedImageUrl && (
            <button className="apple-btn-primary !h-9 text-[13px] gap-1.5 px-4" onClick={handleDownload}>
              <Download className="w-[14px] h-[14px]" />
              {vi.ws_download}
            </button>
          )}
        </div>
      </div>

      {/* ─── Scrollable content: canvas + prompt ─── */}
      <div className="flex-1 overflow-y-auto">
        {/* Canvas area */}
        <div className="flex items-center justify-center p-10">
          {isGenerating ? (
            <div className="text-center space-y-5">
              <div className="w-[72px] h-[72px] mx-auto rounded-[20px] bg-white shadow-apple-md flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-sys-blue" />
              </div>
              <div>
                <p className="text-[17px] font-semibold text-label">{vi.ws_creating}</p>
                <p className="text-[13px] text-label-tertiary mt-1.5">{vi.ws_creating_desc}</p>
              </div>
            </div>
          ) : generatedImageUrl ? (
            <div className="relative max-w-3xl w-full">
              <div className="rounded-2xl overflow-hidden shadow-apple-lg">
                <img src={generatedImageUrl} alt="Generated Thumbnail" className="w-full" />
                {/* Watermark overlay */}
                {watermark.text && (
                  <div
                    className={`absolute pointer-events-none ${watermarkPositionClass}`}
                    style={{
                      opacity: watermark.opacity / 100,
                      color: watermarkColor,
                      fontSize: `${watermark.textSize}px`,
                      fontWeight: watermark.type === "bold-text" ? 700 : 400,
                      textShadow: "0 1px 4px rgba(0,0,0,0.3)",
                      transform: `rotate(${watermark.rotation}deg)`,
                    }}
                  >
                    {watermark.text}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-5">
              <div className="w-[72px] h-[72px] mx-auto rounded-[20px] bg-white shadow-apple flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-label-quaternary" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[17px] font-semibold text-label tracking-tight">
                  {vi.ws_empty_title}
                </p>
                <p className="text-[14px] text-label-tertiary mt-2 max-w-sm mx-auto leading-relaxed">
                  {vi.ws_empty_desc}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ─── AI Prompt section ─── */}
        {generatedPrompt && (
          <div className="px-8 pb-8">
            <div className="apple-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-semibold text-label flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-sys-blue" />
                  {vi.ws_prompt_title}
                </h3>
                <button
                  className="apple-btn-plain text-[12px] gap-1.5 !px-2.5 !py-1 rounded-lg"
                  onClick={() => copyToClipboard(generatedPrompt, "prompt")}
                >
                  {copied === "prompt" ? (
                    <Check className="w-3.5 h-3.5 text-sys-green" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {vi.ws_prompt_copy}
                </button>
              </div>
              <pre className="text-[12px] text-label-secondary leading-relaxed whitespace-pre-wrap font-mono bg-fill-tertiary rounded-xl p-4 max-h-[300px] overflow-y-auto">
                {generatedPrompt}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* ─── Bottom bar — metadata + social ─── */}
      <div className="material-thick border-t border-separator px-8 py-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[13px] font-semibold text-label flex items-center gap-2">
            <FileText className="w-4 h-4 text-sys-blue" />
            {vi.ws_meta_title}
          </h3>
          <button
            className="apple-btn-plain text-[13px] gap-1.5 !px-3 !py-1.5 rounded-full bg-sys-blue/6"
            onClick={handleGenerateMetadata}
            disabled={isGeneratingMeta || !step1.videoTitle}
            style={{ opacity: isGeneratingMeta || !step1.videoTitle ? 0.35 : 1 }}
          >
            {isGeneratingMeta ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            {vi.ws_meta_generate}
          </button>
        </div>

        {metadata ? (
          <div className="apple-card p-4 space-y-3.5">
            {/* Title */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-label-tertiary">
                  {vi.ws_meta_label_title}
                </p>
                <p className="text-[14px] font-medium text-label mt-1 truncate">
                  {metadata.title}
                </p>
              </div>
              <button
                className="w-8 h-8 rounded-lg flex items-center justify-center text-label-tertiary hover:bg-fill-secondary transition-colors flex-shrink-0"
                onClick={() => copyToClipboard(metadata.title, "title")}
              >
                {copied === "title" ? (
                  <Check className="w-4 h-4 text-sys-green" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Description */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-label-tertiary">
                  {vi.ws_meta_label_desc}
                </p>
                <p className="text-[13px] text-label-secondary mt-1 line-clamp-2 leading-relaxed">
                  {metadata.description}
                </p>
              </div>
              <button
                className="w-8 h-8 rounded-lg flex items-center justify-center text-label-tertiary hover:bg-fill-secondary transition-colors flex-shrink-0"
                onClick={() => copyToClipboard(metadata.description, "desc")}
              >
                {copied === "desc" ? (
                  <Check className="w-4 h-4 text-sys-green" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Tags */}
            <div>
              <p className="text-[11px] font-semibold text-label-tertiary mb-2">
                {vi.ws_meta_label_tags}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {metadata.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg bg-fill-secondary text-[11px] font-medium text-label-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-[13px] text-label-tertiary">{vi.ws_meta_empty}</p>
        )}

        {/* Social Links */}
        <div className="mt-4 pt-4 border-t border-separator">
          <p className="text-[11px] font-semibold text-label-tertiary mb-3">
            {vi.ws_social}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] text-label-secondary block mb-1">{vi.ws_social_skool}</label>
              <input
                type="text"
                className="apple-input w-full text-[13px]"
                placeholder={vi.ws_social_skool_ph}
                value={socialLinks.skool}
                onChange={(e) => setSocialLinks({ skool: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[12px] text-label-secondary block mb-1">{vi.ws_social_facebook}</label>
              <input
                type="text"
                className="apple-input w-full text-[13px]"
                placeholder={vi.ws_social_facebook_ph}
                value={socialLinks.facebook}
                onChange={(e) => setSocialLinks({ facebook: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
