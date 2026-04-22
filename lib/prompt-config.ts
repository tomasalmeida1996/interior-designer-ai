// ─── Dropdown option arrays ───────────────────────────────────────────────

export const ROOMS: string[] = [
  "Living Room",
  "Dining Room",
  "Bedroom",
  "Bathroom",
  "Office",
  "Kitchen",
  "Master Bedroom",
  "Kids Room",
  "Home Theater",
  "Study Room",
  "Entryway",
  "Walk-in Closet",
  "Game Room",
  "Home Gym",
  "Laundry Room",
  "Patio",
  "Garden",
  "Art Studio",
  "Music Room",
  "Home Office",
  "Guest Room",
  "Nursery",
  "Home Spa",
  "Home Bar",
  "Home Library",
];

export const STYLES: string[] = [
  "Modern",
  "Vintage",
  "Minimalist",
  "Professional",
  "Industrial",
  "Scandinavian",
  "Bohemian",
  "Contemporary",
  "Traditional",
  "Mid-Century Modern",
  "Coastal",
  "Rustic",
  "Art Deco",
  "Japanese Zen",
  "Mediterranean",
];

export const LIGHTING: string[] = [
  "Natural Light",
  "Warm Ambient",
  "Cool White",
  "Dramatic Spotlight",
  "Soft Diffused",
  "Golden Hour",
  "Overhead Bright",
  "Candlelit",
  "Neon Accent",
  "Daylight Balanced",
];

export const COLOR_PALETTES: string[] = [
  "Neutral Palette",
  "Warm Earth Tones",
  "Cool Blues & Grays",
  "Monochrome",
  "Pastel Soft",
  "Bold & Vibrant",
  "Forest Greens",
  "Ocean Breeze",
  "Sunset Warm",
  "Charcoal & Gold",
];

export const MATERIALS: string[] = [
  "Wood",
  "Marble",
  "Concrete",
  "Leather",
  "Glass",
  "Metal",
  "Velvet",
  "Linen",
  "Brick",
  "Rattan",
  "Ceramic",
  "Stone",
];

// ─── Default negative prompt ──────────────────────────────────────────────

export const DEFAULT_NEGATIVE_PROMPT =
  "ugly, blurry, low quality, distorted, disfigured, bad anatomy, " +
  "watermark, text, signature, cartoon, illustration, anime, " +
  "painting, sketch, oversaturated, bad proportions, deformed";

// ─── Prompt builder ───────────────────────────────────────────────────────

export interface PromptParams {
  room?: string;
  style?: string;
  lighting?: string;
  colorPalette?: string;
  material?: string;
  extraDetails?: string;
}

/**
 * Assembles dropdown selections into a single descriptive prompt string.
 */
export function buildPrompt(params: PromptParams): string {
  const parts: string[] = [];

  if (params.style) {
    parts.push(`A ${params.style}`);
  }

  if (params.room) {
    parts.push(params.room);
  }

  parts.push(
    "Editorial Style Photo, Symmetry, Straight On, " +
      "ultra-detailed, ultra-realistic, award-winning, 4k"
  );

  if (params.lighting) {
    parts.push(params.lighting);
  }

  if (params.colorPalette) {
    parts.push(params.colorPalette);
  }

  if (params.material) {
    parts.push(params.material);
  }

  if (params.extraDetails) {
    parts.push(params.extraDetails);
  }

  return parts.join(", ");
}
