import { NextResponse } from "next/server";

import {
  getSourceMapStore,
  parseSourceMapWindow,
} from "@/app/lib/source-map/store";

function clamp(n: number, lo: number, hi: number) {
  if (Number.isNaN(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

/**
 * GET /api/source-map?userId=&window=30d&maxQueries=20
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId")?.trim() || "demo-user";
  const windowParam = searchParams.get("window")?.trim() || "30d";
  const maxQueries = clamp(Number(searchParams.get("maxQueries") || "20"), 1, 50);
  const windowDays = parseSourceMapWindow(windowParam);

  const payload = getSourceMapStore().getPayload(userId, {
    windowDays,
    maxQueries,
  });

  return NextResponse.json(payload);
}
