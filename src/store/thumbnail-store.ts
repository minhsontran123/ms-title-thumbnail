import { create } from "zustand";

export type TabType = "title" | "thumbnail" | "edit" | "gallery" | "watermark";

export type TitleFormula =
  | "loss_number"
  | "warning"
  | "secret"
  | "journey"
  | "result"
  | "question"
  | "comparison"
  | "controversy"
  | "mistake"
  | "how_to"
  | "exclusive"
  | "beginner";

export interface TitleVariant {
  id: string;
  title: string;
  formula: string;
  formulaKey: TitleFormula;
  score: number;
  scores: {
    emotion: number;
    clarity: number;
    curiosity: number;
    powerWords: number;
    seo: number;
  };
  suggestedEmotionalTrigger: EmotionalTrigger;
  suggestedTextOverlay: string;
  suggestedPrimaryColor: string;
}
export type StudioMode = "full" | "quick";

export type AudienceType = "newbie" | "intermediate" | "advanced" | "general";
export type EmotionalTrigger =
  | "shock"
  | "curiosity"
  | "fomo"
  | "inspiration"
  | "controversy";
export type VisualElement =
  | "high-contrast"
  | "big-face"
  | "curiosity-graph"
  | "giant-text"
  | "red-arrows"
  | "cinematic"
  | "collage";
export type LayoutType = "symmetric" | "rule-of-thirds" | "ab-split";
export type TargetExpression =
  | "shocked"
  | "happy"
  | "angry"
  | "sad"
  | "confused"
  | "excited";
export type TextStyle = "big-bold" | "minimal" | "handwritten" | "neon";
export type TextGoal =
  | "curiosity"
  | "urgency"
  | "value"
  | "controversy"
  | "emotion";
export type VisualStyle =
  | "youtube-viral"
  | "cinematic"
  | "minimalist"
  | "retro"
  | "dark-moody"
  | "colorful-pop"
  | "professional";

// Step 1 — Core Information
export interface StudioStep1 {
  videoTopic: string;
  videoTitle: string;
  audience: AudienceType;
  painPoint: string;
}

// Step 2 — Desire Loop
export interface StudioStep2 {
  currentProblem: string;
  desiredResult: string;
  emotionalTrigger: EmotionalTrigger;
}

// Step 3 — Visual Stun Gun
export interface StudioStep3 {
  visualElements: VisualElement[];
}

// Step 4 — Layout
export interface StudioStep4 {
  layout: LayoutType;
}

// Step 5 — Character Library
export interface StudioStep5 {
  characterEnabled: boolean;
  characterImage: string | null; // base64 or data URL
  targetExpression: TargetExpression;
}

// Step 6 — Text Overlay
export interface StudioStep6 {
  textOverlay: string;
  textStyle: TextStyle;
  textGoal: TextGoal;
}

// Step 7 — Colors & Contrast
export interface StudioStep7 {
  primaryColor: string;
  dropShadow: boolean;
  highContrast: boolean;
}

// Step 8 — Visual Style
export interface StudioStep8 {
  visualStyle: VisualStyle;
  customStyleId: string | null;
}

// Style Library
export interface StylePreset {
  id: string;
  name: string;
  channelName: string;
  analysis: string; // AI-generated style description
  referenceImages: string[]; // base64 thumbnails
  createdAt: string;
}

export interface GeneratedThumbnail {
  id: string;
  imageUrl: string;
  prompt: string;
  createdAt: string;
  steps: {
    step1: StudioStep1;
    step2: StudioStep2;
    step3: StudioStep3;
    step4: StudioStep4;
    step5: StudioStep5;
    step6: StudioStep6;
    step7: StudioStep7;
    step8: StudioStep8;
  };
}

// Watermark
export type WatermarkPreset = "branding" | "anti-repost" | "educational";
export type WatermarkType = "subtle-text" | "bold-text" | "image";
export type WatermarkPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center"
  | "auto-smart";
export type WatermarkColorMode = "adaptive" | "light" | "dark";
export type WatermarkPlatform = "youtube" | "instagram" | "tiktok" | "general";

export interface WatermarkSettings {
  preset: WatermarkPreset | null;
  uploadedImage: string | null; // base64
  text: string;
  type: WatermarkType;
  position: WatermarkPosition;
  colorMode: WatermarkColorMode;
  platform: WatermarkPlatform;
  opacity: number;
  textSize: number;
  rotation: number;
  avoidFaces: boolean;
  repeatPattern: boolean;
}

interface ThumbnailStore {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;

  studioMode: StudioMode;
  setStudioMode: (mode: StudioMode) => void;

  currentStep: number;
  setCurrentStep: (step: number) => void;

  // 8 steps
  step1: StudioStep1;
  setStep1: (data: Partial<StudioStep1>) => void;
  step2: StudioStep2;
  setStep2: (data: Partial<StudioStep2>) => void;
  step3: StudioStep3;
  setStep3: (data: Partial<StudioStep3>) => void;
  step4: StudioStep4;
  setStep4: (data: Partial<StudioStep4>) => void;
  step5: StudioStep5;
  setStep5: (data: Partial<StudioStep5>) => void;
  step6: StudioStep6;
  setStep6: (data: Partial<StudioStep6>) => void;
  step7: StudioStep7;
  setStep7: (data: Partial<StudioStep7>) => void;
  step8: StudioStep8;
  setStep8: (data: Partial<StudioStep8>) => void;

  // Gallery
  gallery: GeneratedThumbnail[];
  addToGallery: (thumbnail: GeneratedThumbnail) => void;
  removeFromGallery: (id: string) => void;

  // Edit
  selectedThumbnail: GeneratedThumbnail | null;
  setSelectedThumbnail: (thumbnail: GeneratedThumbnail | null) => void;
  editInstruction: string;
  setEditInstruction: (instruction: string) => void;

  // Watermark
  watermark: WatermarkSettings;
  setWatermark: (data: Partial<WatermarkSettings>) => void;

  // Style Library
  stylePresets: StylePreset[];
  addStylePreset: (preset: StylePreset) => void;
  removeStylePreset: (id: string) => void;

  // Title Studio
  titleTopic: string;
  setTitleTopic: (topic: string) => void;
  titleAudience: AudienceType;
  setTitleAudience: (audience: AudienceType) => void;
  generatedTitles: TitleVariant[];
  setGeneratedTitles: (titles: TitleVariant[]) => void;
  selectedTitle: TitleVariant | null;
  setSelectedTitle: (title: TitleVariant | null) => void;
  isTitleGenerating: boolean;
  setIsTitleGenerating: (val: boolean) => void;

  // Workspace
  isGenerating: boolean;
  setIsGenerating: (val: boolean) => void;
  generatedImageUrl: string | null;
  setGeneratedImageUrl: (url: string | null) => void;
  generatedPrompt: string | null;
  setGeneratedPrompt: (prompt: string | null) => void;
  socialLinks: { skool: string; facebook: string };
  setSocialLinks: (data: Partial<{ skool: string; facebook: string }>) => void;
}

export const useThumbnailStore = create<ThumbnailStore>((set) => ({
  activeTab: "title",
  setActiveTab: (tab) => set({ activeTab: tab }),

  studioMode: "quick",
  setStudioMode: (mode) => set({ studioMode: mode }),

  currentStep: 1,
  setCurrentStep: (step) => set({ currentStep: step }),

  step1: { videoTopic: "", videoTitle: "", audience: "general", painPoint: "" },
  setStep1: (data) => set((s) => ({ step1: { ...s.step1, ...data } })),

  step2: { currentProblem: "", desiredResult: "", emotionalTrigger: "curiosity" },
  setStep2: (data) => set((s) => ({ step2: { ...s.step2, ...data } })),

  step3: { visualElements: [] },
  setStep3: (data) => set((s) => ({ step3: { ...s.step3, ...data } })),

  step4: { layout: "rule-of-thirds" },
  setStep4: (data) => set((s) => ({ step4: { ...s.step4, ...data } })),

  step5: { characterEnabled: false, characterImage: null, targetExpression: "shocked" },
  setStep5: (data) => set((s) => ({ step5: { ...s.step5, ...data } })),

  step6: { textOverlay: "", textStyle: "big-bold", textGoal: "curiosity" },
  setStep6: (data) => set((s) => ({ step6: { ...s.step6, ...data } })),

  step7: { primaryColor: "#FF3B30", dropShadow: true, highContrast: false },
  setStep7: (data) => set((s) => ({ step7: { ...s.step7, ...data } })),

  step8: { visualStyle: "youtube-viral", customStyleId: null },
  setStep8: (data) => set((s) => ({ step8: { ...s.step8, ...data } })),

  gallery: [],
  addToGallery: (thumbnail) => set((s) => ({ gallery: [thumbnail, ...s.gallery] })),
  removeFromGallery: (id) => set((s) => ({ gallery: s.gallery.filter((t) => t.id !== id) })),

  selectedThumbnail: null,
  setSelectedThumbnail: (thumbnail) => set({ selectedThumbnail: thumbnail }),
  editInstruction: "",
  setEditInstruction: (instruction) => set({ editInstruction: instruction }),

  watermark: {
    preset: null,
    uploadedImage: null,
    text: "@MSSpace",
    type: "subtle-text",
    position: "auto-smart",
    colorMode: "adaptive",
    platform: "youtube",
    opacity: 8,
    textSize: 40,
    rotation: 0,
    avoidFaces: true,
    repeatPattern: false,
  },
  setWatermark: (data) => set((s) => ({ watermark: { ...s.watermark, ...data } })),

  stylePresets: [],
  addStylePreset: (preset) => set((s) => ({ stylePresets: [...s.stylePresets, preset] })),
  removeStylePreset: (id) => set((s) => ({ stylePresets: s.stylePresets.filter((p) => p.id !== id) })),

  titleTopic: "",
  setTitleTopic: (topic) => set({ titleTopic: topic }),
  titleAudience: "general",
  setTitleAudience: (audience) => set({ titleAudience: audience }),
  generatedTitles: [],
  setGeneratedTitles: (titles) => set({ generatedTitles: titles }),
  selectedTitle: null,
  setSelectedTitle: (title) => set({ selectedTitle: title }),
  isTitleGenerating: false,
  setIsTitleGenerating: (val) => set({ isTitleGenerating: val }),

  isGenerating: false,
  setIsGenerating: (val) => set({ isGenerating: val }),
  generatedImageUrl: null,
  setGeneratedImageUrl: (url) => set({ generatedImageUrl: url }),
  generatedPrompt: null,
  setGeneratedPrompt: (prompt) => set({ generatedPrompt: prompt }),
  socialLinks: { skool: "", facebook: "" },
  setSocialLinks: (data) => set((s) => ({ socialLinks: { ...s.socialLinks, ...data } })),
}));
