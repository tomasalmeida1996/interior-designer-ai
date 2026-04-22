import { AIModel } from "@/types";

function controlnetpreprocessInput(input: any) {
  return {
    image: input.image,
    prompt: `A ${input.theme} ${input.room} Editorial Style Photo, Symmetry, Straight On, Modern Living Room, Large Window, Leather, Glass, Metal, Wood Paneling, Neutral Palette, Ikea, Natural Light, Apartment, Afternoon, Serene, Contemporary, 4k`,
    a_prompt: `best quality, extremely detailed, photo from Pinterest, interior, cinematic photo, ultra-detailed, ultra-realistic, award-winning`,
    ...input.parameters,
  };
}

function adirikPreprocessInput(input: any) {
  return {
    image: input.image,
    prompt: `A ${input.theme} ${input.room} Editorial Style Photo, Symmetry, Straight On, Modern Living Room, Large Window, Leather, Glass, Metal, Wood Paneling, Neutral Palette, Ikea, Natural Light, Apartment, Afternoon, Serene, Contemporary, 4k`,
    //   a_prompt: `best quality, extremely detailed, photo from Pinterest, interior, cinematic photo, ultra-detailed, ultra-realistic, award-winning`,
    ...input.parameters,
  };
}

function passthroughPreprocessOutput(result: any) {
  return {
    output: typeof result?.output === "string" ? result.output : "",
    mask: typeof result?.mask === "string" ? result.mask : undefined,
  };
}

export const models: AIModel[] = [
  {
    id: "replicate-jagilley-interior-designer",
    apiModelId: "jagilley",
    name: "Jagilley Interior Designer",
    description: "Transform your room with AI-powered interior design",
    requiresImage: true,
    requiresStyle: true,
    requiresRoomType: true,
    url: "jagilley/controlnet-hough:854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b",
    preprocessInput: controlnetpreprocessInput,
    preprocessOutput: (result: any) => ({
      //   input: result.input?.image,
      output: result.output[1],
      mask: result.output[0],
    }),
    hasMask: true,
    parameters: [
      {
        name: "prompt",
        type: "string",
        label: "Additional Prompt",
        description: "Additional details to guide the generation",
        default: "",
        isAdvanced: true,
      },
      {
        name: "negative_prompt",
        type: "string",
        label: "Negative Prompt",
        description: "What to avoid in the generation",
        default: "bad quality, low quality, blurry",
        isAdvanced: true,
      },
      {
        name: "num_inference_steps",
        type: "number",
        label: "Inference Steps",
        description:
          "Number of denoising steps (higher = better quality but slower)",
        default: 30,
        min: 1,
        max: 100,
        step: 1,
        isAdvanced: true,
      },
      {
        name: "guidance_scale",
        type: "number",
        label: "Guidance Scale",
        description: "How much to follow the prompt (higher = more strict)",
        default: 7.5,
        min: 1,
        max: 20,
        step: 0.1,
        isAdvanced: true,
      },
    ],
  },
  {
    id: "replicate-adirik-interior-designer-v2",
    apiModelId: "adirik",
    name: "Adirik Interior Design",
    description: "Enhanced interior design model with better quality",
    requiresImage: true,
    requiresStyle: true,
    requiresRoomType: true,
    url: "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
    preprocessInput: adirikPreprocessInput,
    preprocessOutput: (result: any) => ({
      //   input: result.input?.image,
      output: result.output,
      mask: undefined,
    }),
    hasMask: false,
    parameters: [
      {
        name: "prompt",
        type: "string",
        label: "Additional Prompt",
        description: "Additional details to guide the generation",
        default: "",
        isAdvanced: true,
      },
      {
        name: "negative_prompt",
        type: "string",
        label: "Negative Prompt",
        description: "What to avoid in the generation",
        default:
          "lowres, watermark, banner, logo, watermark, contactinfo, text, deformed, blurry, blur, out of focus, out of frame, surreal, extra, ugly, upholstered walls, fabric walls, plush walls, mirror, mirrored, functional, realistic",
        isAdvanced: true,
      },
      {
        name: "num_inference_steps",
        type: "number",
        label: "Inference Steps",
        description:
          "Number of denoising steps (higher = better quality but slower)",
        default: 337,
        min: 1,
        max: 500,
        step: 1,
        isAdvanced: true,
      },
      {
        name: "prompt_strength",
        type: "number",
        label: "Prompt Strength",
        description: "How much to change the original image",
        default: 0.9,
        min: 0,
        max: 1,
        step: 0.05,
        isAdvanced: true,
      },
      {
        name: "guidance_scale",
        type: "number",
        label: "Guidance Scale",
        description: "How much to follow the prompt (higher = more strict)",
        default: 15,
        min: 1,
        max: 50,
        step: 0.1,
        isAdvanced: true,
      },
    ],
  },
  {
    id: "replicate-rocketdigital-interior-sdxl",
    apiModelId: "rocketdigital",
    name: "RealVisXL v5 SDXL",
    description:
      "RealVisXL v5 + dual ControlNet depth — higher quality, slower",
    requiresImage: true,
    requiresStyle: true,
    requiresRoomType: true,
    url: "rocketdigitalai/interior-design-sdxl",
    preprocessOutput: passthroughPreprocessOutput,
    hasMask: false,
    parameters: [
      {
        name: "prompt",
        type: "string",
        label: "Additional Prompt",
        description: "Additional details to guide the generation",
        default: "",
        isAdvanced: true,
      },
      {
        name: "negative_prompt",
        type: "string",
        label: "Negative Prompt",
        description: "What to avoid in the generation",
        default:
          "ugly, blurry, low quality, distorted, watermark, text, cartoon, anime",
        isAdvanced: true,
      },
      {
        name: "num_inference_steps",
        type: "number",
        label: "Inference Steps",
        description:
          "Number of denoising steps (higher = better quality but slower)",
        default: 50,
        min: 1,
        max: 150,
        step: 1,
        isAdvanced: true,
      },
      {
        name: "guidance_scale",
        type: "number",
        label: "Guidance Scale",
        description: "How much to follow the prompt (higher = more strict)",
        default: 15,
        min: 1,
        max: 30,
        step: 0.1,
        isAdvanced: true,
      },
    ],
  },
  {
    id: "replicate-flux-depth-pro",
    apiModelId: "flux-depth",
    name: "FLUX Depth Pro",
    description: "FLUX depth-aware model — modern architecture",
    requiresImage: true,
    requiresStyle: true,
    requiresRoomType: true,
    url: "black-forest-labs/flux-depth-pro",
    preprocessOutput: passthroughPreprocessOutput,
    hasMask: false,
    parameters: [
      {
        name: "prompt",
        type: "string",
        label: "Additional Prompt",
        description:
          "Optional: replaces the default room/style prompt when set",
        default: "",
        isAdvanced: true,
      },
      {
        name: "num_inference_steps",
        type: "number",
        label: "Steps",
        description: "Denoising steps",
        default: 50,
        min: 1,
        max: 100,
        step: 1,
        isAdvanced: true,
      },
      {
        name: "guidance_scale",
        type: "number",
        label: "Guidance",
        description: "Prompt adherence (maps to model guidance)",
        default: 15,
        min: 1,
        max: 30,
        step: 0.5,
        isAdvanced: true,
      },
    ],
  },
];
