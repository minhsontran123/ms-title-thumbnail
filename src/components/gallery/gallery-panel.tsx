"use client";

import { LayoutGrid, Trash2, Download, Pencil, ImageIcon } from "lucide-react";
import { useThumbnailStore } from "@/store/thumbnail-store";
import { vi } from "@/lib/vi";

export function GalleryPanel() {
  const {
    gallery,
    removeFromGallery,
    setSelectedThumbnail,
    setActiveTab,
    setGeneratedImageUrl,
  } = useThumbnailStore();

  const handleEdit = (thumb: (typeof gallery)[0]) => {
    setSelectedThumbnail(thumb);
    setActiveTab("edit");
  };

  const handleDownload = (imageUrl: string, id: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `ms-thumbnail-${id}.png`;
    link.click();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-4 pb-3">
        <h3 className="text-[15px] font-semibold text-label tracking-tight flex items-center gap-2.5">
          <LayoutGrid className="w-[18px] h-[18px] text-sys-blue" />
          {vi.gal_title}
        </h3>
        <p className="text-[13px] text-label-tertiary mt-1">
          {vi.gal_count(gallery.length)}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {gallery.length === 0 ? (
          <div className="rounded-2xl bg-fill-tertiary p-12 text-center mt-2">
            <ImageIcon className="w-12 h-12 mx-auto text-label-quaternary mb-4" />
            <p className="text-[17px] font-semibold text-label">
              {vi.gal_empty_title}
            </p>
            <p className="text-[13px] text-label-tertiary mt-1.5">
              {vi.gal_empty_desc}
            </p>
            <button
              className="apple-btn-primary mt-5 !h-10 text-[13px] px-5"
              onClick={() => setActiveTab("studio")}
            >
              {vi.gal_open_studio}
            </button>
          </div>
        ) : (
          <div className="space-y-4 mt-1">
            {gallery.map((thumb) => (
              <div key={thumb.id} className="apple-card overflow-hidden">
                <button
                  className="w-full"
                  onClick={() => setGeneratedImageUrl(thumb.imageUrl)}
                >
                  <img src={thumb.imageUrl} alt="" className="w-full aspect-video object-cover" />
                </button>
                <div className="px-4 py-3 flex items-center justify-between">
                  <span className="text-[12px] text-label-tertiary font-medium">
                    {new Date(thumb.createdAt).toLocaleString("vi-VN")}
                  </span>
                  <div className="flex gap-0.5">
                    <button
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-label-secondary hover:bg-fill-secondary transition-colors"
                      onClick={() => handleEdit(thumb)}
                    >
                      <Pencil className="w-[15px] h-[15px]" />
                    </button>
                    <button
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-label-secondary hover:bg-fill-secondary transition-colors"
                      onClick={() => handleDownload(thumb.imageUrl, thumb.id)}
                    >
                      <Download className="w-[15px] h-[15px]" />
                    </button>
                    <button
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sys-red hover:bg-sys-red/8 transition-colors"
                      onClick={() => removeFromGallery(thumb.id)}
                    >
                      <Trash2 className="w-[15px] h-[15px]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
