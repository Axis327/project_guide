import { useEffect, useState } from "react";
import type { FloorKey, VenueBundle } from "../types/venue";

export function useVenueData() {
  const [bundle, setBundle] = useState<VenueBundle | null>(null);
  const [svgMarkup, setSvgMarkup] = useState<Record<FloorKey, string>>({
    L1: "",
    L2: "",
  });

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetch("/venue-bundle.json").then((r) => r.json() as Promise<VenueBundle>),
      fetch("/oakville-place-l1.svg").then((r) => r.text()),
      fetch("/oakville-place-l2.svg").then((r) => r.text()),
    ]).then(([bundleData, l1Text, l2Text]) => {
      if (cancelled) return;
      setBundle(bundleData);
      setSvgMarkup({ L1: l1Text, L2: l2Text });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { bundle, svgMarkup };
}