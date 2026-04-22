# Interior Designer AI — Multi-Model

Upload a photo of any room and let AI redesign it. Choose from three
Replicate models depending on your speed/quality/cost needs.

## Models

| Model                                 | Cost/run | Speed  | Quality   |
| ------------------------------------- | -------- | ------ | --------- |
| Realistic Vision v3 (`adirik`)        | ~$0.007  | ~8s    | Good      |
| RealVisXL v5 SDXL (`rocketdigitalai`) | ~$0.18   | ~2 min | Excellent |
| FLUX Depth Pro (`black-forest-labs`)  | ~$0.05   | ~30s   | Excellent |

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/interior-designer-ai.git
cd interior-designer-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your Replicate API token

Rename `.env.example` to `.env.local` and add your token:

```
REPLICATE_API_TOKEN=your_token_here
```

Get a token at [replicate.com](https://replicate.com) — free tier available.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How to Use

1. **Pick a model** — choose based on your speed/quality/budget preference
2. **Configure your design** — use the dropdowns to set room type, style, lighting, palette, and materials
3. **Upload a photo** — drag & drop or click to upload a JPEG/PNG under 5 MB
4. **Generate** — review the assembled prompt, then click Generate
5. **Download** — save the result with the download button

## Adding a New Model

Edit `lib/models.ts` — add one entry to `MODELS` with the model's Replicate ID,
display metadata, and a `buildInput()` function that maps the shared params to
that model's specific API schema. Nothing else needs to change.

## Project Structure

```
├── app/
│   ├── api/replicate/route.ts   # Unified API route (all models)
│   ├── page.tsx                 # Main UI
│   └── layout.tsx
├── lib/
│   ├── models.ts                # Model registry
│   └── prompt-config.ts         # Dropdown options + buildPrompt()
├── .env.example
└── README.md
```

## Stack

- [Next.js 14](https://nextjs.org) — App Router
- [Replicate](https://replicate.com) — AI model API
- [Tailwind CSS](https://tailwindcss.com)
- [react-dropzone](https://react-dropzone.js.org)
