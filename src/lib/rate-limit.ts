type RateLimitEntry = {
  count: number;
  resetAt: number;
};

export type RateLimitResult = {
  limited: boolean;
  retryAfterSeconds: number;
};

/**
 * Rate limit em memória, best-effort por instância do servidor.
 *
 * A poda periódica evita que o Map cresça indefinidamente com chaves que não
 * voltam. Para proteção distribuída seria necessário um store externo.
 */
export function createRateLimiter({
  windowMs,
  max,
  pruneAbove = 500,
}: {
  windowMs: number;
  max: number;
  pruneAbove?: number;
}): (key: string) => RateLimitResult {
  const hits = new Map<string, RateLimitEntry>();

  function prune(now: number) {
    for (const [key, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(key);
    }
  }

  return function isLimited(key: string): RateLimitResult {
    const now = Date.now();
    if (hits.size > pruneAbove) prune(now);

    const entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return { limited: false, retryAfterSeconds: 0 };
    }

    entry.count += 1;
    const limited = entry.count > max;
    return {
      limited,
      retryAfterSeconds: limited
        ? Math.max(1, Math.ceil((entry.resetAt - now) / 1000))
        : 0,
    };
  };
}
