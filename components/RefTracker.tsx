"use client";

import { useEffect } from "react";

export default function RefTracker() {
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (ref) {
      fetch("/api/affiliates/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: ref }),
      }).catch(() => {});
    }
  }, []);

  return null;
}
