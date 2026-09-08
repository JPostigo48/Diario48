import type { ImportedTrackSource } from "@/lib/music-tracker/types";

const TITLE_NOISE_PATTERNS = [
  /\bofficial music video\b/gi,
  /\bofficial video\b/gi,
  /\blyric video\b/gi,
  /\blyrics\b/gi,
  /\baudio\b/gi,
  /\bhd\b/gi,
  /\bremastered\b/gi,
  /\blive\b/gi,
  /\[[^\]]*\]/g,
  /\([^\)]*\)/g,
];

export interface NormalizedImportedTrack {
  normalizedTitle: string;
  normalizedArtist: string;
}

export function normalizeImportedTrack(
  track: Pick<ImportedTrackSource, "originalTitle" | "originalVisibleArtist" | "originalChannelName">,
): NormalizedImportedTrack {
  const cleanedTitle = TITLE_NOISE_PATTERNS.reduce(
    (currentTitle, pattern) => currentTitle.replace(pattern, " "),
    track.originalTitle,
  )
    .replace(/\s+/g, " ")
    .trim();

  const titleParts = cleanedTitle.split(" - ").map((part) => part.trim()).filter(Boolean);

  const normalizedArtist =
    track.originalVisibleArtist.trim() ||
    titleParts[0] ||
    track.originalChannelName.trim();

  const normalizedTitle =
    titleParts.length > 1
      ? titleParts.slice(1).join(" - ")
      : cleanedTitle;

  return {
    normalizedTitle,
    normalizedArtist,
  };
}
