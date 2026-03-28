"use client";

import { Loader2, Pencil, ImageIcon } from "lucide-react";
import { useThumbnailStore } from "@/store/thumbnail-store";
import { vi } from "@/lib/vi";

const quickEdits = [
  vi.edit_q1, vi.edit_q2, vi.edit_q3,
  vi.edit_q4, vi.edit_q5, vi.edit_q6,
];

export function EditPanel() {
  const {
    gallery,
    selectedThumbnail,
    setSelectedThumbnail,
    editInstruction,
    setEditInstruction,
    setGeneratedImageUrl,
    isGenerating,
    setIsGenerating,
    addToGallery,
  } = useThumbnailStore();

  const handleApplyEdit = async () => {
    if (!selectedThumbnail || !editInstruction) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: selectedThumbnail.imageUrl,
          instruction: editInstruction,
        }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
        addToGallery({
          ...selectedThumbnail,
          id: crypto.randomUUID(),
          imageUrl: data.imageUrl,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error("Edit failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-4 pb-3">
        <h3 className="text-[15px] font-semibold text-label tracking-tight flex items-center gap-2.5">
          <Pencil className="w-[18px] h-[18px] text-sys-blue" />
          {vi.edit_title}
        </h3>
        <p className="text-[13px] text-label-tertiary mt-1">{vi.edit_desc}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-5">
        {/* Thumbnail selector */}
        <div>
          <label className="text-[13px] font-medium text-label-secondary block mb-2.5 px-1">
            {vi.edit_select}
          </label>
          {gallery.length === 0 ? (
            <div className="rounded-2xl bg-fill-tertiary p-10 text-center">
              <ImageIcon className="w-10 h-10 mx-auto text-label-quaternary mb-3" />
              <p className="text-[13px] text-label-tertiary">{vi.edit_empty}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {gallery.map((thumb) => (
                <button
                  key={thumb.id}
                  onClick={() => setSelectedThumbnail(thumb)}
                  className="rounded-xl overflow-hidden transition-all"
                  style={{
                    boxShadow:
                      selectedThumbnail?.id === thumb.id
                        ? "0 0 0 2.5px #007AFF, 0 2px 8px rgba(0,122,255,0.2)"
                        : "0 0 0 0.5px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)",
                  }}
                >
                  <img src={thumb.imageUrl} alt="" className="w-full aspect-video object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Edit instruction */}
        <div className="apple-card">
          <div className="apple-row">
            <label className="text-[13px] font-medium text-label-secondary block mb-2">
              {vi.edit_instruction}
            </label>
            <textarea
              className="apple-textarea"
              placeholder={vi.edit_instruction_ph}
              rows={3}
              value={editInstruction}
              onChange={(e) => setEditInstruction(e.target.value)}
              disabled={!selectedThumbnail}
            />
          </div>
        </div>

        {/* Quick edits */}
        <div>
          <label className="text-[13px] font-medium text-label-secondary block mb-2.5 px-1">
            {vi.edit_quick}
          </label>
          <div className="flex flex-wrap gap-2">
            {quickEdits.map((edit) => (
              <button
                key={edit}
                onClick={() => setEditInstruction(edit)}
                className="apple-pill apple-pill-inactive text-[12px]"
              >
                {edit}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="p-6 pt-4 material-thick border-t border-separator">
        <button
          className="apple-btn-primary w-full"
          onClick={handleApplyEdit}
          disabled={!selectedThumbnail || !editInstruction || isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              {vi.edit_applying}
            </>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-1.5" />
              {vi.edit_apply}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
