import { FLOORS } from "../constants/map";
import type { FloorKey, LayerVisibility } from "../types/venue";

interface MapControlsProps {
  activeFloor: FloorKey;
  layers: LayerVisibility;
  onToggleLayer: (key: keyof LayerVisibility) => void;
  onSelectFloor: (floor: FloorKey) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export function MapControls({
  activeFloor,
  layers,
  onToggleLayer,
  onSelectFloor,
  onZoomIn,
  onZoomOut,
}: MapControlsProps) {
  return (
    <>
      <div className="top-left-controls">
        <button
          className={layers.washrooms ? "active" : ""}
          onClick={() => onToggleLayer("washrooms")}
        >
          Bathrooms
        </button>
        <button
          className={layers.entrances ? "active" : ""}
          onClick={() => onToggleLayer("entrances")}
        >
          Entrances
        </button>
        <button
          className={layers.connectors ? "active" : ""}
          onClick={() => onToggleLayer("connectors")}
        >
          Elevators/Stairs
        </button>
      </div>

      <div className="top-right-controls">
        {FLOORS.map((fl) => (
          <button
            key={fl}
            className={activeFloor === fl ? "active" : ""}
            onClick={() => onSelectFloor(fl)}
          >
            {fl}
          </button>
        ))}
      </div>

      <div className="bottom-left-controls">
        <button onClick={onZoomIn}>+</button>
        <button onClick={onZoomOut}>−</button>
      </div>
    </>
  );
}