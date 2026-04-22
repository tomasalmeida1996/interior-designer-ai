# Interior Designer AI — Multi-Model

## Purpose

You are helping build and maintain a Next.js 14 interior design AI app.
Users upload a room photo, configure a prompt using guided dropdowns,
pick a Replicate AI model, and receive a redesigned room image.

## Tech Stack

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS
- Replicate API (Node.js SDK)
- react-dropzone, file-saver, react-icons, @heroicons/react

## Project Structure

- `lib/models.ts` — central model registry (all Replicate models, their inputs/outputs, cost, speed)
- `lib/prompt-config.ts` — dropdown options (rooms, styles, lighting, palettes, materials) and buildPrompt()
- `app/api/replicate/route.ts` — unified API route, handles all models, normalises outputs
- `app/page.tsx` — main UI: model selector cards, guided prompt builder, image upload, output viewer

## Supported Models

1. `adirik/interior-design` — SD1.5 + MLSD ControlNet, cheapest (~$0.007/run), ~8s, single image output (URI string)
2. `rocketdigitalai/interior-design-sdxl` — RealVisXL v5 + dual ControlNet depth, best quality (~$0.18/run), ~2min, single image output
3. `black-forest-labs/flux-depth-pro` — FLUX architecture, depth-aware, modern (~$0.05/run), ~30s, single image output

## Model Input Differences

- `adirik`: image, prompt, negative_prompt, guidance_scale, prompt_strength, num_inference_steps
- `rocketdigitalai`: image, prompt, negative_prompt, guidance_scale, num_inference_steps (no prompt_strength)
- `flux-depth-pro`: image, prompt, guidance (not guidance_scale), steps (not num_inference_steps), output_format, output_quality (no negative_prompt)

## Output Normalisation

All models return a single image URI. The API route always returns `{ output: string, modelId, modelName }`.
Never use `result.output[1]` — the old jagilley/controlnet-hough pattern. Always `result.output`.

## Adding a New Model

1. Add an entry to `MODELS` in `lib/models.ts`
2. Define its `buildInput()` mapping shared GenerateParams to its specific API schema
3. Set `outputType: "single" | "array"` and `outputIndex` if needed
4. No changes needed to the API route or UI — it reads from the registry automatically

## Prompt Builder

The UI has dropdowns for: Room Type, Style, Lighting, Color Palette, Material.
Plus a free-text "Extra details" field and an Advanced section (guidance scale, prompt strength, inference steps).
`buildPrompt()` in `lib/prompt-config.ts` assembles these into the final prompt string shown to the user.

## Key Rules

- Never hardcode a model string in the API route — always read from `lib/models.ts`
- Always show the assembled prompt to the user before generating (read-only textarea)
- Default negative prompt lives in `lib/prompt-config.ts` as `DEFAULT_NEGATIVE_PROMPT`
- FLUX Depth Pro ignores `negative_prompt` and `prompt_strength` — do not send them
- Image is always sent as base64 data URL
- Keep model config and UI logic strictly separated
