import { NextResponse } from "next/server";
import Replicate from "replicate";
import {
  MODELS,
  DEFAULTS,
  type ModelId,
  type GenerateParams,
} from "@/lib/models";

function toUrlString(val: unknown): string {
  if (typeof val === "string") return val;
  if (val != null) return String(val);
  return "";
}

export async function POST(request: Request) {
  const req = await request.json();

  const {
    modelId = "adirik",
    image,
    prompt,
    negativePrompt,
    guidanceScale,
    promptStrength,
    numInferenceSteps,
    // Legacy fields — still accepted from the existing UI
    theme,
    room,
    parameters,
  } = req;

  // ── 1. Look up the model config ──────────────────────────────────────
  const modelConfig = MODELS[modelId as ModelId];

  if (!modelConfig) {
    return NextResponse.json(
      { error: `Unknown modelId "${modelId}"` },
      { status: 400 }
    );
  }

  // ── 2. Build the shared GenerateParams ───────────────────────────────
  // Support both the new flat params AND the legacy { theme, room, parameters } shape
  const fromThemeRoom =
    theme && room
      ? `A ${theme} ${room} Editorial Style Photo, Symmetry, Straight On, ultra-detailed, ultra-realistic, award-winning, 4k`
      : "";

  const paramPrompt =
    typeof parameters?.prompt === "string" && parameters.prompt.trim()
      ? parameters.prompt
      : undefined;

  const resolvedPrompt =
    (typeof prompt === "string" && prompt.trim() ? prompt : undefined) ??
    paramPrompt ??
    fromThemeRoom;

  const isJagilley = modelId === "jagilley";

  const generateParams: GenerateParams = {
    image,
    prompt: resolvedPrompt,
    negativePrompt:
      negativePrompt ??
      parameters?.negative_prompt ??
      (isJagilley
        ? "bad quality, low quality, blurry"
        : DEFAULTS.negativePrompt),
    guidanceScale:
      guidanceScale ??
      parameters?.guidance_scale ??
      (isJagilley ? 7.5 : DEFAULTS.guidanceScale),
    promptStrength:
      promptStrength ?? parameters?.prompt_strength ?? DEFAULTS.promptStrength,
    numInferenceSteps:
      numInferenceSteps ??
      parameters?.num_inference_steps ??
      (isJagilley ? 30 : DEFAULTS.numInferenceSteps),
  };

  // ── 3. Build model-specific input and run ────────────────────────────
  const input = modelConfig.buildInput(generateParams);

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN as string,
  });

  try {
    const output = await replicate.run(
      modelConfig.replicateModel as `${string}/${string}:${string}`,
      { input }
    );

    if (!output) {
      return NextResponse.json(
        { error: "No output from model" },
        { status: 500 }
      );
    }

    // ── 4. Normalise output to a single image URI ────────────────────
    let imageUri: string;

    if (modelConfig.outputType === "array" && Array.isArray(output)) {
      imageUri = toUrlString(output[modelConfig.outputIndex ?? 0]);
    } else if (Array.isArray(output)) {
      // Safety: even if config says "single", handle unexpected arrays
      imageUri = toUrlString(output[modelConfig.outputIndex ?? 0]);
    } else {
      imageUri = toUrlString(output);
    }

    let maskUri: string | undefined;
    if (
      modelConfig.maskOutputIndex !== undefined &&
      Array.isArray(output) &&
      output[modelConfig.maskOutputIndex] != null
    ) {
      maskUri = toUrlString(output[modelConfig.maskOutputIndex]);
    }

    return NextResponse.json(
      {
        output: imageUri,
        ...(maskUri ? { mask: maskUri } : {}),
        modelId: modelConfig.id,
        modelName: modelConfig.name,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error running model:", error);
    const detail = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Error running model", detail },
      { status: 500 }
    );
  }
}
