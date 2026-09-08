import type {
  DuplicateDetectionPort,
  DuplicateDetectionRequest,
  DuplicateSuggestion,
} from "@/features/music-tracker/duplicate-detection/application/ports/DuplicateDetectionPort";

export class HeuristicDuplicateDetectionService implements DuplicateDetectionPort {
  async detect(request: DuplicateDetectionRequest): Promise<DuplicateSuggestion[]> {
    const suggestions = request.candidates
      .filter((candidate) => candidate.id && candidate.id !== request.baseSong.id)
      .map((candidate) => buildSuggestion(request.baseSong, candidate))
      .filter((suggestion): suggestion is DuplicateSuggestion => suggestion !== null)
      .sort((left, right) => right.suspicionScore - left.suspicionScore);

    return suggestions;
  }
}

function buildSuggestion(
  baseSong: DuplicateDetectionRequest["baseSong"],
  candidate: DuplicateDetectionRequest["candidates"][number],
): DuplicateSuggestion | null {
  const reasons: string[] = [];
  let score = 0;

  const exactLinkMatch = baseSong.externalLinks.some((baseLink) =>
    candidate.externalLinks.some(
      (candidateLink) =>
        Boolean(baseLink.url) &&
        baseLink.url === candidateLink.url,
    ),
  );

  if (exactLinkMatch) {
    score += 0.7;
    reasons.push("Coincidencia exacta por URL externa.");
  }

  const exactExternalIdMatch = baseSong.externalLinks.some((baseLink) =>
    candidate.externalLinks.some(
      (candidateLink) =>
        Boolean(baseLink.externalId) &&
        baseLink.provider === candidateLink.provider &&
        baseLink.externalId === candidateLink.externalId,
    ),
  );

  if (exactExternalIdMatch) {
    score += 0.8;
    reasons.push("Coincidencia exacta por identificador externo.");
  }

  const normalizedTitleSimilarity = similarityScore(
    baseSong.canonicalTitle,
    candidate.canonicalTitle,
  );
  if (normalizedTitleSimilarity >= 0.85) {
    score += 0.4;
    reasons.push("Título canónico muy parecido.");
  }

  const normalizedArtistSimilarity = similarityScore(
    baseSong.canonicalArtist,
    candidate.canonicalArtist,
  );
  if (normalizedArtistSimilarity >= 0.85) {
    score += 0.3;
    reasons.push("Artista canónico muy parecido.");
  }

  if (
    typeof baseSong.year === "number" &&
    typeof candidate.year === "number" &&
    baseSong.year === candidate.year
  ) {
    score += 0.1;
    reasons.push("Comparten año.");
  }

  const boundedScore = Math.min(1, Number(score.toFixed(2)));
  if (boundedScore < 0.5) {
    return null;
  }

  return {
    candidateSongIds: [baseSong.id ?? "", candidate.id ?? ""],
    suspicionScore: boundedScore,
    reasons,
  };
}

function similarityScore(left: string, right: string) {
  const normalizedLeft = normalizeComparableText(left);
  const normalizedRight = normalizeComparableText(right);

  if (!normalizedLeft || !normalizedRight) {
    return 0;
  }

  if (normalizedLeft === normalizedRight) {
    return 1;
  }

  const leftWords = new Set(normalizedLeft.split(" "));
  const rightWords = new Set(normalizedRight.split(" "));
  const intersection = [...leftWords].filter((word) => rightWords.has(word)).length;
  const union = new Set([...leftWords, ...rightWords]).size;

  return union ? intersection / union : 0;
}

function normalizeComparableText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}
