import { MatchingResult, ProductCandidate } from "../types/catalog";

export function matchCandidate(candidate: ProductCandidate): MatchingResult {
  // MVP: we don't have a canonical DB yet; the "match" is simply the generated possibleCanonicalId.
  if (!candidate.possibleCanonicalId) {
    return {
      candidateId: candidate.id,
      possibleCanonicalId: null,
      confidence: 0,
      reasons: ["no_possible_canonical_id"],
      status: "unmatched",
    };
  }

  const confidence = candidate.matchingConfidence;
  const status: MatchingResult["status"] = confidence >= 0.82 ? "matched" : "needs_review";

  return {
    candidateId: candidate.id,
    possibleCanonicalId: candidate.possibleCanonicalId,
    confidence,
    reasons: ["canonical_id_from_extraction"],
    status,
  };
}

