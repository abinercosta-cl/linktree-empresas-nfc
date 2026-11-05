const MAX_KEYS = 10_000;

const windows = new Map<string, { count: number; resetAt: number }>();

// Janela fixa em memória: o contador é por processo e zera a cada restart.
export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();

  if (windows.size >= MAX_KEYS) {
    for (const [storedKey, entry] of windows) {
      if (entry.resetAt <= now) windows.delete(storedKey);
    }
    if (windows.size >= MAX_KEYS) windows.clear();
  }

  const current = windows.get(key);

  if (!current || current.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  current.count += 1;

  return {
    allowed: current.count <= limit,
    retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000),
  };
}
