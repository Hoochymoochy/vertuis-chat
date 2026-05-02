"use client";

import { SourceMap } from "@/app/components/source-map/SourceMap";
import { SourceMapOverviewProvider } from "@/app/components/source-map/SourceMapOverviewContext";

export default function SourceMapPage() {
  return (
    <SourceMapOverviewProvider>
      <SourceMap />
    </SourceMapOverviewProvider>
  );
}
