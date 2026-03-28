export interface PromptData {
  step1: { videoTopic: string; videoTitle: string; audience: string; painPoint: string };
  step2: { currentProblem: string; desiredResult: string; emotionalTrigger: string };
  step3: { visualElements: string[] };
  step4: { layout: string };
  step5: { characterEnabled: boolean; targetExpression: string };
  step6: { textOverlay: string; textStyle: string; textGoal: string };
  step7: { primaryColor: string; dropShadow: boolean; highContrast: boolean };
  step8: { visualStyle: string; customStyleId?: string | null };
  customStyleAnalysis?: string | null;
}

export function buildPrompt(data: PromptData): string {
  const { step1, step2, step3, step4, step5, step6, step7, step8, customStyleAnalysis } = data;

  const characterSection = step5.characterEnabled
    ? `\nCHARACTER: Include a person with a ${step5.targetExpression} facial expression prominently in the thumbnail.`
    : "";

  const effectsList: string[] = [];
  if (step7.dropShadow) effectsList.push("strong drop shadow on text");
  if (step7.highContrast) effectsList.push("high contrast between foreground and background");

  return `Create a professional YouTube thumbnail image with the following specifications:

TOPIC: ${step1.videoTitle || step1.videoTopic}
TARGET AUDIENCE: ${step1.audience}
PAIN POINT: ${step1.painPoint}

PSYCHOLOGY:
- Current viewer problem: ${step2.currentProblem}
- Desired result: ${step2.desiredResult}
- Emotional trigger: ${step2.emotionalTrigger} — the thumbnail should evoke this emotion instantly

VISUAL DESIGN:
- Visual elements: ${step3.visualElements.join(", ") || "eye-catching"}
- Layout: ${step4.layout}
- Primary color: ${step7.primaryColor}
- Visual style: ${step8.visualStyle}
${effectsList.length > 0 ? `- Effects: ${effectsList.join(", ")}` : ""}
${characterSection}

TEXT OVERLAY: "${step6.textOverlay}" in ${step6.textStyle} style
TEXT GOAL: Create ${step6.textGoal}

REQUIREMENTS:
- Must be visually stunning and scroll-stopping
- High contrast between elements
- Text must be large and readable even at small sizes
- Professional quality, not clipart
- YouTube thumbnail aspect ratio (16:9)
- Style: ${step8.visualStyle} — apply this visual style consistently${customStyleAnalysis ? `\n\nCUSTOM STYLE REFERENCE (highest priority — match this style closely):\n${customStyleAnalysis}` : ""}`;
}
