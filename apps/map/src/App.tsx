import { useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { MapControls } from "./components/MapControls";
import { MapOverlays } from "./components/MapOverlays";
import { MapViewport } from "./components/MapViewport";
import { useMapCamera } from "./hooks/useMapCamera";
import { useVenueData } from "./hooks/useVenueData";
import type { FloorKey, LayerVisibility } from "./types/venue";
import "./App.css";

export default function App() {
  const viewportRef = useRef<HTMLDivElement>(null);

  const { bundle, svgMarkup } = useVenueData();
  const { camera, movedRef, zoomBy, handlers } = useMapCamera(viewportRef, bundle);

  const [activeFloor, setActiveFloor] = useState<FloorKey>("L2");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [layers, setLayers] = useState<LayerVisibility>({
    washrooms: true,
    entrances: true,
    connectors: true,
  });

  const currentFloor = useMemo(() => {
    if (!bundle) return null;
    return bundle.floors.find((f) => f.short_name === activeFloor) ?? null;
  }, [bundle, activeFloor]);

  const toggleLayer = (key: keyof LayerVisibility) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const selectFloor = (next: FloorKey) => {
    if (next === activeFloor) return;
    setActiveFloor(next);
    setSelectedId(null);
  };

  const handleMapClick = (e: MouseEvent<HTMLDivElement>) => {
    if (movedRef.current || !currentFloor) return;
    const target = e.target as Element;
    const clickedId = target.id || target.parentElement?.id;

    if (!clickedId) {
      setSelectedId(null);
      return;
    }

    const isUnit = currentFloor.units.some((u) => u.svg_id === clickedId);
    const isConn = bundle?.connections.some((c) => c.svg_id === clickedId);

    if (isUnit || isConn) {
      setSelectedId((prev) => (prev === clickedId ? null : clickedId));
    } else {
      setSelectedId(null);
    }
  };

  return (
    <div className="app-shell">
      <MapControls
        activeFloor={activeFloor}
        layers={layers}
        onToggleLayer={toggleLayer}
        onSelectFloor={selectFloor}
        onZoomIn={() => zoomBy(1.25)}
        onZoomOut={() => zoomBy(0.8)}
      />

      <MapViewport
        viewportRef={viewportRef}
        camera={camera}
        activeFloor={activeFloor}
        svgMarkup={svgMarkup}
        selectedId={selectedId}
        showWashrooms={layers.washrooms}
        onMapClick={handleMapClick}
        handlers={handlers}
      >
        <MapOverlays
          bundle={bundle}
          currentFloor={currentFloor}
          activeFloor={activeFloor}
          camera={camera}
          viewportRef={viewportRef}
          layers={layers}
          selectedId={selectedId}
        />
      </MapViewport>
    </div>
  );
}