# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # install dependencies
npm run dev        # start dev server at http://localhost:3000
npm run build      # production build
npm run lint       # Next.js ESLint
```

There is no test suite. Prettier runs automatically on staged files via Husky pre-commit hooks (`.js`, `.ts`, `.tsx`, `.jsx`, `.css`, `.md`).

**Required environment variable:** Copy `.env.example` to `.env.local` and set `REPLICATE_API_TOKEN` from replicate.com/account/api-tokens.

## Architecture

This is a **Next.js 14 App Router** application. Users upload a room photo, configure a design prompt via dropdowns, select a Replicate AI model, and receive a redesigned room image.

### Request flow

1. `app/page.tsx` — user uploads image (base64 data URL), selects model and prompt options, calls `buildPrompt()`, then POSTs to `/api/replicate`
2. `app/api/replicate/route.ts` — receives `{ modelId, image, prompt, ... }`, looks up the model in `MODELS`, calls `modelConfig.buildInput()` to build model-specific API input, runs via Replicate SDK, normalizes output to `{ output: string, mask?: string, modelId, modelName }`
3. `app/context/HistoryContext.tsx` — result is stored in React Context and persisted to localStorage (max 10 items)

### Model registry (`lib/models.ts`)

**This is the single source of truth for all models.** Adding a model only requires a new entry in `MODELS` — the API route and UI read from it automatically. Never hardcode a model string in the API route.

Each `ModelConfig` entry defines:
- `replicateModel`: the full versioned Replicate model string
- `outputType`: `"single"` or `"array"`, plus optional `outputIndex` / `maskOutputIndex`
- `buildInput(params: GenerateParams)`: maps the shared `GenerateParams` to that model's specific API schema

**Current models and their API quirks:**

| Key | Model | Notable input differences |
|---|---|---|
| `adirik` | SD1.5 + MLSD ControlNet | standard field names, supports `prompt_strength` |
| `rocketdigital` | RealVisXL v5 SDXL | no `prompt_strength` |
| `flux-depth` | FLUX Depth Pro | `control_image` (not `image`), `guidance` (not `guidance_scale`), `steps` (not `num_inference_steps`), no `negative_prompt`, no `prompt_strength` |
| `jagilley` | ControlNet Hough | array output: index 1 = result, index 0 = structure mask |

### Prompt builder (`lib/prompt-config.ts`)

`buildPrompt()` assembles dropdown selections (room, style, lighting, color palette, material) and a free-text `extraDetails` field into the final prompt string shown in the read-only textarea. `DEFAULT_NEGATIVE_PROMPT` is the shared negative prompt used by all models that accept one.

Always show the assembled prompt to the user before generating (read-only textarea in the UI).

### Type system

- `lib/models.ts` — `GenerateParams`, `ModelConfig`, `ModelId`, `MODELS`, `DEFAULTS` — the canonical types used by the API layer
- `types/index.ts` — UI-facing types (`NavItem`, `AIModel`, `ModelParameter`, `ModelOutput`, `ModelValues`)
- `config/models.ts` — legacy UI model config array that bridges dropdown selections to API; exists alongside `lib/models.ts` for the older UI components

### Key constraints

- Images are always transmitted as **base64 data URLs** (never multipart)
- The API route accepts the legacy `{ theme, room, parameters }` shape for backwards compatibility — do not remove this
- FLUX Depth Pro: do not send `negative_prompt` or `prompt_strength` in `buildInput()`; clamp `steps` to 15–50
- The jagilley model returns `output[1]` as the image and `output[0]` as the structure mask — never use `result.output[1]` directly from the client, always use `result.output` from the normalized API response
- History is localStorage-only, capped at 10 items; no backend database
