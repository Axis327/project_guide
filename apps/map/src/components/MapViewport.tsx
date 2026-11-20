import type { MouseEvent, PointerEvent, ReactNode, RefObject } from "react";
import type { CameraState, FloorKey } from "../types/venue";

interface MapViewportProps {
  viewportRef: RefObject<HTMLDivElement | null>;
  camera: CameraState;
  activeFloor: FloorKey;
  svgMarkup: Record<FloorKey, string>;
  selectedId: string | null;
  showWashrooms: boolean;
  onMapClick: (e: MouseEvent<HTMLDivElement>) => void;
  handlers: {
    onPointerDown: (e: PointerEvent<HTMLDivElement>) => void;
    onPointerMove: (e: PointerEvent<HTMLDivElement>) => void;
    onPointerUp: (e: PointerEvent<HTMLDivElement>) => void;
    onPointerCancel: (e: PointerEvent<HTMLDivElement>) => void;
    onPointerLeave: (e: PointerEvent<HTMLDivElement>) => void;
  };
  children?: ReactNode;
}

export function MapViewport({
  viewportRef,
  camera,
  activeFloor,
  svgMarkup,
  selectedId,
  showWashrooms,
  onMapClick,
  handlers,
  children,
}: MapViewportProps) {
  return (
    <>
      {/* highlight selected svg zone + dim washrooms when toggled off */}
      <style>{`
        ${
          selectedId
            ? `#axis-floorplan-${activeFloor.toLowerCase()} #${selectedId} {
                 fill: #93c5fd !important;
                 stroke: #1d4ed8 !important;
                 stroke-width: 3px !important;
               }`
            : ""
        }
        ${!showWashrooms ? `.zone-washroom { opacity: 0.15; }` : ""}
      `}</style>

      <div
        ref={viewportRef}
        className="map-viewport"
        {...handlers}
        onClick={onMapClick}
      >
        <div
          className="map-stage"
          style={{
            transform: `translate3d(${camera.x}px, ${camera.y}px, 0) scale(${camera.scale})`,
          }}
        >
          <div
            className={`svg-floor-layer ${activeFloor === "L1" ? "visible" : ""}`}
            dangerouslySetInnerHTML={{ __html: svgMarkup.L1 }}
          />
          <div
            className={`svg-floor-layer ${activeFloor === "L2" ? "visible" : ""}`}
            dangerouslySetInnerHTML={{ __html: svgMarkup.L2 }}
          />
        </div>

        {children}
      </div>
    </>
  );
}