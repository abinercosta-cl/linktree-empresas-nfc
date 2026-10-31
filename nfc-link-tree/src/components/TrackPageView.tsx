"use client";

import { useEffect, useRef } from "react";

interface TrackPageViewProps {
  empresaId: string;
  origem?: string;
}

export default function TrackPageView({ empresaId, origem }: TrackPageViewProps) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) return;
    trackedRef.current = true;

    let source = origem;
    if (!source && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      source = params.get("src") || undefined;
    }

    const payload = JSON.stringify({
      empresaId,
      tipo: "view",
      origem: source || "direto",
    });

    try {
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/track", blob);
      } else {
        fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch (e) {
      console.debug("Telemetry track error:", e);
    }
  }, [empresaId, origem]);

  return null;
}
