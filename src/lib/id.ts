/**
 * Generates a short unique ID with an optional prefix.
 * Uses crypto.randomUUID when available, falls back to Math.random.
 */
export function generateId(prefix = 'node'): string {
  const uuid =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID().split('-')[0]
      : Math.random().toString(36).slice(2, 9);
  return `${prefix}_${uuid}`;
}

/**
 * Generates a timestamp-based edge ID.
 */
export function generateEdgeId(sourceId: string, targetId: string): string {
  return `edge_${sourceId}_${targetId}_${Date.now()}`;
}
