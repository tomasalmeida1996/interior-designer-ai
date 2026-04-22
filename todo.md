# Interior Designer AI — Todo List

## ✅ Done

- [x] Existing Next.js project with Replicate API integration
- [x] Basic image upload with react-dropzone
- [x] Theme and room type selectors
- [x] Download output image
- [x] Mobile sidebar + desktop sidebar
- [x] Vercel Analytics
- [x] Husky + lint-staged + Prettier setup

---

## 🔴 High Priority

### Model Upgrade

- [ ] Replace `jagilley/controlnet-hough` with multi-model registry
- [ ] Create `lib/models.ts` with all three model configs
- [ ] Create unified `app/api/replicate/route.ts` that reads from model registry
- [ ] Handle output normalisation (all models return single URI string, not array)
- [ ] Fix `setOutputImage(result.output[1])` → `setOutputImage(result.output)`

### Prompt Builder

- [ ] Create `lib/prompt-config.ts` with all dropdown options and `buildPrompt()`
- [ ] Replace hardcoded theme/room arrays in `page.tsx` with imports from prompt-config
- [ ] Add Lighting dropdown
- [ ] Add Color Palette dropdown
- [ ] Add Materials dropdown
- [ ] Add free-text "Extra details" input
- [ ] Show assembled prompt to user in a read-only textarea before generating

### UI — Model Selector

- [ ] Build model card components (name, badge, cost, speed, quality)
- [ ] Wire model selection to API request payload
- [ ] Show cost/speed warning when user picks the expensive SDXL model

---

## 🟡 Medium Priority

### Advanced Controls

- [ ] Add collapsible "Advanced" section
- [ ] Guidance scale slider (default 15)
- [ ] Prompt strength slider (default 0.8) — hide for FLUX Depth Pro
- [ ] Inference steps slider (default 50)
- [ ] Negative prompt textarea (pre-filled with default, editable)
- [ ] Seed input (optional, for reproducibility)

### History Page (`/history`)

- [ ] Decide on storage strategy (localStorage vs database)
- [ ] Save each generation: input image thumbnail, output image, model used, prompt, timestamp
- [ ] Display history as a grid
- [ ] Add delete individual entry
- [ ] Add clear all history

### UX Improvements

- [ ] Loading state shows which model is running and estimated wait time
- [ ] Error messages are user-friendly (map Replicate error codes)
- [ ] Disable generate button while loading
- [ ] Show a before/after slider to compare input and output images
- [ ] Toast notifications for success/error

---

## 🟢 Nice to Have

### Features

- [ ] Allow multiple output variations (num_outputs > 1 where supported)
- [ ] Inpainting mode — mask areas to redesign only part of the room
- [ ] Prompt presets / saved favourite prompts
- [ ] Share output image via link
- [ ] Export prompt as text so users can reuse it elsewhere

### Developer Experience

- [ ] Add model version pinning (hash) to `lib/models.ts` for reproducibility
- [ ] Add integration tests for the API route
- [ ] Add a `/models` page showing all available models and their specs
- [ ] Environment variable validation on startup (throw if REPLICATE_API_TOKEN missing)

### Performance

- [ ] Stream progress updates from Replicate (webhook or polling)
- [ ] Optimise base64 image before sending (resize to max 1024px)
- [ ] Add rate limiting to the API route

---

## 📦 New Dependencies Needed

- No new dependencies required — all models use the existing `replicate` SDK
