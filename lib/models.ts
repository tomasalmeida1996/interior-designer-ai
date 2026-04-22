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
export type ModelId = "jagilley" | "adirik" | "rocketdigital" | "flux-depth";

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
  /** When set and the run returns an array, this index is returned as `mask` from the API. */
  maskOutputIndex?: number;
  buildInput(params: GenerateParams): Record<string, unknown>;
}

// ─── Model registry ───────────────────────────────────────────────────────
export const MODELS: Record<ModelId, ModelConfig> = {
  // 0. Jagilley — ControlNet Hough (mask + result)
  jagilley: {
    id: "jagilley",
    name: "Jagilley Interior Designer",
    description: "ControlNet Hough — includes structure mask in output",
    badge: "Classic",
    badgeColor: "emerald",
    costPerRun: "~$0.02",
    speed: "~30s",
    quality: "Good",
    replicateModel:
      "jagilley/controlnet-hough:854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b",
    outputType: "array",
    outputIndex: 1,
    maskOutputIndex: 0,
    buildInput(params: GenerateParams): Record<string, unknown> {
      return {
        image: params.image,
        prompt: params.prompt,
        a_prompt:
          "best quality, extremely detailed, photo from Pinterest, interior, cinematic photo, ultra-detailed, ultra-realistic, award-winning",
        negative_prompt: params.negativePrompt,
        guidance_scale: params.guidanceScale,
        num_inference_steps: params.numInferenceSteps,
      };
    },
  },

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
    replicateModel:
      "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
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
    replicateModel:
      "rocketdigitalai/interior-design-sdxl:a3c091059a25590ce2d5ea13651fab63f447f21760e50c358d4b850e844f59ee",
    outputType: "single",
    buildInput(params: GenerateParams): Record<string, unknown> {
      // Note: does NOT accept prompt_strength — omitted
      return {
        image: params.image,
        prompt: params.prompt,
        negative_prompt: params.negativePrompt,
        guidance_scale: params.guidanceScale,
        num_inference_steps: params.numInferenceSteps,
        promax_strength: 0.8,
        depth_strength: 0.8,
        refiner_strength: 0.4,
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
    replicateModel:
      "black-forest-labs/flux-depth-pro:c86388b54d5d9eea8c9cfb70a7ee0d40a55c7a3010ecec8e14c21c9bd64d3af8",
    outputType: "single",
    buildInput(params: GenerateParams): Record<string, unknown> {
      // API expects control_image (not "image"); guidance + steps per schema
      const steps = Math.min(50, Math.max(15, params.numInferenceSteps));
      return {
        control_image: params.image,
        prompt: params.prompt,
        guidance: params.guidanceScale,
        steps,
        output_format: "jpg",
      };
    },
  },
};

// ─── Convenience list for iteration ───────────────────────────────────────
export const MODEL_LIST: ModelConfig[] = Object.values(MODELS);
