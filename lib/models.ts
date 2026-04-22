// ─── Shared input interface used by all models ────────────────────────────
export interface GenerateParams {
  image: string; // base64 data URL
  prompt: string;
  negativePrompt: string; // ignored by flux-depth
  guidanceScale: number; // sent as "guidance" for flux-depth
  promptStrength: number; // ignored by rocketdigital and flux-depth
  numInferenceSteps: number; // sent as "steps" for flux-depth
}

// ─── Defaults (applied when the caller doesn't provide a value) ───────────
export const DEFAULTS: Omit<GenerateParams, "image" | "prompt"> = {
  guidanceScale: 15,
  promptStrength: 0.8,
  numInferenceSteps: 50,
  negativePrompt:
    "ugly, blurry, low quality, distorted, disfigured, bad anatomy, " +
    "watermark, text, signature, cartoon, illustration, anime, " +
    "painting, sketch, oversaturated, bad proportions, deformed",
};

// ─── Model ID union type ──────────────────────────────────────────────────
export type ModelId = "adirik" | "rocketdigital" | "flux-depth";

// ─── Model config interface ───────────────────────────────────────────────
export interface ModelConfig {
  id: ModelId;
  name: string;
  description: string;
  badge: string;
  badgeColor: "emerald" | "violet" | "amber";
  costPerRun: string;
  speed: string;
  quality: string;
  replicateModel: string;
  outputType: "single" | "array";
  outputIndex?: number;
  buildInput(params: GenerateParams): Record<string, unknown>;
}

// ─── Model registry ───────────────────────────────────────────────────────
export const MODELS: Record<ModelId, ModelConfig> = {
  // 1. Adirik — Realistic Vision v3 (SD1.5 + MLSD ControlNet)
  adirik: {
    id: "adirik",
    name: "Adirik Interior Design",
    description: "SD1.5 + MLSD ControlNet — fast and cheap",
    badge: "Best Value",
    badgeColor: "emerald",
    costPerRun: "~$0.007",
    speed: "~8s",
    quality: "Good",
    replicateModel: "adirik/interior-design",
    outputType: "single",
    buildInput(params: GenerateParams): Record<string, unknown> {
      return {
        image: params.image,
        prompt: params.prompt,
        negative_prompt: params.negativePrompt,
        guidance_scale: params.guidanceScale,
        prompt_strength: params.promptStrength,
        num_inference_steps: params.numInferenceSteps,
      };
    },
  },

  // 2. RocketDigital — RealVisXL v5 SDXL (dual ControlNet depth)
  rocketdigital: {
    id: "rocketdigital",
    name: "RealVisXL v5 SDXL",
    description: "RealVisXL v5 + dual ControlNet depth — best quality",
    badge: "Best Quality",
    badgeColor: "violet",
    costPerRun: "~$0.18",
    speed: "~2 min",
    quality: "Excellent",
    replicateModel: "rocketdigitalai/interior-design-sdxl",
    outputType: "single",
    buildInput(params: GenerateParams): Record<string, unknown> {
      // Note: does NOT accept prompt_strength — omitted
      return {
        image: params.image,
        prompt: params.prompt,
        negative_prompt: params.negativePrompt,
        guidance_scale: params.guidanceScale,
        num_inference_steps: params.numInferenceSteps,
      };
    },
  },

  // 3. FLUX Depth Pro — modern depth-aware architecture
  "flux-depth": {
    id: "flux-depth",
    name: "FLUX Depth Pro",
    description: "FLUX architecture — depth-aware, modern",
    badge: "Modern",
    badgeColor: "amber",
    costPerRun: "~$0.05",
    speed: "~30s",
    quality: "Excellent",
    replicateModel: "black-forest-labs/flux-depth-pro",
    outputType: "single",
    buildInput(params: GenerateParams): Record<string, unknown> {
      // Note: does NOT accept negative_prompt or prompt_strength — omitted
      // Uses "guidance" instead of "guidance_scale", "steps" instead of "num_inference_steps"
      return {
        image: params.image,
        prompt: params.prompt,
        guidance: params.guidanceScale,
        steps: params.numInferenceSteps,
        output_format: "webp",
        output_quality: 90,
      };
    },
  },
};

// ─── Convenience list for iteration ───────────────────────────────────────
export const MODEL_LIST: ModelConfig[] = Object.values(MODELS);
