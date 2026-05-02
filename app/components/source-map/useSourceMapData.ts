"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { SourceMapAPIResponse } from "./sourceMap.types";

const CACHE_MS = 5 * 60 * 1000;

type CacheEntry = { at: number; data: SourceMapAPIResponse };

const globalCache = new Map<string, CacheEntry>();

function cacheKey(userId: string, windowParam: string, maxQueries: number) {
  return `${userId}|${windowParam}|${maxQueries}`;
}

export type UseSourceMapDataResult = {
  data: SourceMapAPIResponse | null;
  loading: boolean;
  error: boolean;
  /** Clears the in-memory cache entry and refetches (use after errors). */
  refresh: () => Promise<void>;
};

export function useSourceMapData(
  userId: string,
  options?: { window?: string; maxQueries?: number }
): UseSourceMapDataResult {
  const windowParam = options?.window ?? "30d";
  const maxQueries = options?.maxQueries ?? 20;
  const [data, setData] = useState<SourceMapAPIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const mounted = useRef(true);

  const fetchData = useCallback(
    async (opts?: { bypassCache?: boolean }) => {
      const key = cacheKey(userId, windowParam, maxQueries);
      if (opts?.bypassCache) {
        globalCache.delete(key);
      }

      const cached = globalCache.get(key);
      const now = Date.now();
      if (cached && now - cached.at < CACHE_MS) {
        if (mounted.current) {
          setData(cached.data);
          setLoading(false);
          setError(false);
        }
        return;
      }

      if (mounted.current) {
        setLoading(true);
        setError(false);
      }

      try {
        const qs = new URLSearchParams({
          userId,
          window: windowParam,
          maxQueries: String(maxQueries),
        });
        const res = await fetch(`/api/source-map?${qs.toString()}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("bad status");
        const json = (await res.json()) as SourceMapAPIResponse;
        globalCache.set(key, { at: Date.now(), data: json });
        if (mounted.current) {
          setData(json);
          setError(false);
        }
      } catch {
        if (mounted.current) {
          setError(true);
          setData(null);
        }
      } finally {
        if (mounted.current) setLoading(false);
      }
    },
    [userId, windowParam, maxQueries]
  );

  const refresh = useCallback(() => fetchData({ bypassCache: true }), [fetchData]);

  useEffect(() => {
    mounted.current = true;
    void fetchData();
    return () => {
      mounted.current = false;
    };
  }, [fetchData]);

  return { data, loading, error, refresh };
}
