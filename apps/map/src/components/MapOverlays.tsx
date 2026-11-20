import { useMemo } from "react";
import type { RefObject } from "react";
import { LABEL_BASE_SCALE } from "../constants/map";
import type {
  CameraState,
  Floor,
  FloorKey,
  LayerVisibility,
  VenueBundle,
} from "../types/venue";

interface MapOverlaysProps {
  bundle: VenueBundle | null;
  currentFloor: Floor | null;
  activeFloor: FloorKey;
  camera: CameraState;
  viewportRef: RefObject<HTMLDivElement | null>;
  layers: LayerVisibility;
  selectedId: string | null;
}

export function MapOverlays({
  bundle,
  currentFloor,
  activeFloor,
  camera,
  viewportRef,
  layers,
  selectedId,
}: MapOverlaysProps) {
  const relativeZoom = camera.scale / LABEL_BASE_SCALE;

  // project to screen space and skip anything outside the viewport
  const visibleLabels = useMemo(() => {
    if (!currentFloor || !viewportRef.current) return [];
    const vw = viewportRef.current.clientWidth;
    const vh = viewportRef.current.clientHeight;
    const out: { id: string; name: string; x: number; y: number; selected: boolean }[] = [];

    for (const u of currentFloor.units) {
      if (!layers.washrooms && u.category.toLowerCase().includes("washroom")) {
        continue;
      }
      if (relativeZoom < u.min_zoom && selectedId !== u.svg_id) {
        continue;
      }

      const x = camera.x + u.label_anchor.x * camera.scale;
      const y = camera.y + u.label_anchor.y * camera.scale;
      if (x < -80 || x > vw + 80 || y < -30 || y > vh + 30) continue;

      out.push({
        id: u.svg_id,
        name: u.name,
        x,
        y,
        selected: u.svg_id === selectedId,
      });
    }

    return out;
  }, [currentFloor, camera, viewportRef, relativeZoom, layers.washrooms, selectedId]);

  if (!currentFloor || !bundle) return null;

  return (
    <div className="label-overlay">
      {visibleLabels.map((lbl) => (
        <div
          key={lbl.id}
          className={`map-label ${lbl.selected ? "selected" : ""}`}
          style={{
            transform: `translate3d(${lbl.x}px, ${lbl.y}px, 0) translate(-50%, -50%)`,
          }}
        >
          {lbl.name}
        </div>
      ))}

      {layers.entrances &&
        currentFloor.entrances.map((ent) => (
          <div
            key={ent.anchor_id}
            className="map-tag entrance"
            style={{
              transform: `translate3d(${camera.x + ent.position.x * camera.scale}px, ${camera.y + ent.position.y * camera.scale}px, 0) translate(-50%, -50%)`,
            }}
          >
            IN
          </div>
        ))}

      {layers.connectors &&
        bundle.connections
          .filter((c) => c.endpoints.some((ep) => ep.floor === activeFloor))
          .map((conn) => (
            <div
              key={conn.svg_id}
              className="map-tag connector"
              style={{
                transform: `translate3d(${camera.x + conn.position.x * camera.scale}px, ${camera.y + conn.position.y * camera.scale}px, 0) translate(-50%, -50%)`,
              }}
            >
              {conn.type === "elevator" ? "ELEV" : "STAIR"}
            </div>
          ))}
    </div>
  );
}