"use client";

import {
  Type,
  Monitor,
  Wand2,
  LayoutGrid,
  Droplets,
} from "lucide-react";
import { useThumbnailStore, type TabType } from "@/store/thumbnail-store";
import { TitlePanel } from "@/components/title/title-panel";
import { StudioPanel } from "@/components/studio/studio-panel";
import { EditPanel } from "@/components/edit/edit-panel";
import { GalleryPanel } from "@/components/gallery/gallery-panel";
import { WatermarkPanel } from "@/components/watermark/watermark-panel";
import { Workspace } from "@/components/workspace/workspace";
import { vi } from "@/lib/vi";

const tabs: { id: TabType; label: string; icon: typeof Monitor }[] = [
  { id: "title", label: vi.tab_title, icon: Type },
  { id: "thumbnail", label: vi.tab_thumbnail, icon: Monitor },
  { id: "edit", label: vi.tab_edit, icon: Wand2 },
  { id: "gallery", label: vi.tab_gallery, icon: LayoutGrid },
  { id: "watermark", label: vi.tab_watermark, icon: Droplets },
];

function SidebarContent() {
  const { activeTab } = useThumbnailStore();
  switch (activeTab) {
    case "title":
      return <TitlePanel />;
    case "thumbnail":
      return <StudioPanel />;
    case "edit":
      return <EditPanel />;
    case "gallery":
      return <GalleryPanel />;
    case "watermark":
      return <WatermarkPanel />;
    default:
      return null;
  }
}

export default function Home() {
  const { activeTab, setActiveTab } = useThumbnailStore();

  return (
    <div className="flex h-screen overflow-hidden bg-sys-bg">
      {/* ─── Icon Rail ─── */}
      <nav className="w-[88px] min-w-[88px] flex flex-col items-center pt-6 pb-4 gap-2 bg-grouped-bg-secondary border-r border-separator">
        {/* App icon */}
        <div className="w-11 h-11 rounded-[12px] bg-sys-blue flex items-center justify-center shadow-apple-sm mb-5">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3l1.912 5.813a2 2 0 001.272 1.272L21 12l-5.813 1.912a2 2 0 00-1.272 1.272L12 21l-1.912-5.813a2 2 0 00-1.272-1.272L3 12l5.813-1.912a2 2 0 001.272-1.272z" />
          </svg>
        </div>

        {/* Tab icons */}
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 w-[72px] py-3 rounded-xl transition-colors ${
                isActive
                  ? "text-sys-blue"
                  : "text-label-secondary hover:text-label"
              }`}
            >
              <Icon className="w-[22px] h-[22px]" strokeWidth={isActive ? 2.2 : 1.8} />
              <span className={`text-[11px] leading-tight ${isActive ? "font-semibold" : "font-medium"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ─── Panel ─── */}
      <aside className="w-[400px] min-w-[400px] flex flex-col h-full bg-grouped-bg-secondary border-r border-separator">
        {/* Panel header */}
        <div className="px-6 pt-6 pb-4">
          <h1 className="text-[17px] font-semibold tracking-tight text-label">
            {activeTab === "title" ? vi.ts_title : vi.app_title}
          </h1>
          <p className="text-[13px] text-label-secondary mt-0.5">
            {activeTab === "title" ? vi.ts_subtitle : vi.app_subtitle}
          </p>
        </div>

        <div className="flex-1 overflow-hidden">
          <SidebarContent />
        </div>
      </aside>

      {/* ─── Workspace ─── */}
      <Workspace />
    </div>
  );
}
