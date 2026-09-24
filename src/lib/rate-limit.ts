import { headers } from "next/headers";

// Simple in-memory sliding-window rate limiter.
// NOTE: state lives in process memory, so it resets on server restart and does
// not work across multiple instances — move this to Redis/Upstash (or similar
// shared storage) before a real multi-instance deploy.

type Hit = number;

const WINDOW_MS = 60_000;
const buckets = new Map<string, Hit[]>();

/**
 * Records an attempt for `key` and reports whether it should be allowed.
 * Uses a sliding window of `windowMs` (default 60s) capped at `limit` hits.
 */
export function checkRateLimit(
  key: string,
  limit = 5,
  windowMs = WINDOW_MS
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);

  if (hits.length >= limit) {
    const retryAfterMs = windowMs - (now - hits[0]);
    buckets.set(key, hits);
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)) };
  }

  hits.push(now);
  buckets.set(key, hits);
  return { allowed: true, retryAfterSeconds: 0 };
}

/** Best-effort client IP for rate-limit keys: check x-forwarded-for, then other common proxy headers. */
export async function getClientIp(): Promise<string> {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  const realIp = headersList.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}
