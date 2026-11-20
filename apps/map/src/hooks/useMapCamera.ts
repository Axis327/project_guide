import { useEffect, useRef, useState } from "react";
import type { PointerEvent, RefObject } from "react";
import { MAX_SCALE, MIN_SCALE, VIEWBOX_H, VIEWBOX_W } from "../constants/map";
import type { CameraState } from "../types/venue";

export function useMapCamera(
  viewportRef: RefObject<HTMLDivElement | null>,
  fitTrigger: unknown
) {
  const [camera, setCamera] = useState<CameraState>({
    x: 0,
    y: 0,
    scale: 0.4,
  });

  const dragRef = useRef({
    active: false,
    pointerId: -1,
    lastX: 0,
    lastY: 0,
  });
  const movedRef = useRef(false);

  // center and fit the floorplan when data loads
  useEffect(() => {
    if (!viewportRef.current) return;
    const { clientWidth, clientHeight } = viewportRef.current;
    const fitScale =
      Math.min(clientWidth / VIEWBOX_W, clientHeight / VIEWBOX_H) * 0.95;

    setCamera({
      scale: fitScale,
      x: (clientWidth - VIEWBOX_W * fitScale) / 2,
      y: (clientHeight - VIEWBOX_H * fitScale) / 2,
    });
  }, [fitTrigger, viewportRef]);

  // stop mobile browsers from scrolling/bouncing while panning
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const prevent = (e: Event) => e.preventDefault();
    el.addEventListener("touchmove", prevent, { passive: false });
    return () => el.removeEventListener("touchmove", prevent);
  }, [viewportRef]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current.active) return;
    dragRef.current = {
      active: true,
      pointerId: e.pointerId,
      lastX: e.clientX,
      lastY: e.clientY,
    };
    movedRef.current = false;
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active || drag.pointerId !== e.pointerId) return;

    const dx = e.clientX - drag.lastX;
    const dy = e.clientY - drag.lastY;
    if (Math.hypot(dx, dy) > 3) movedRef.current = true;

    drag.lastX = e.clientX;
    drag.lastY = e.clientY;

    setCamera((c) => ({ ...c, x: c.x + dx, y: c.y + dy }));
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current.pointerId === e.pointerId) {
      dragRef.current.active = false;
      dragRef.current.pointerId = -1;
    }
  };

  const zoomBy = (factor: number) => {
    if (!viewportRef.current) return;
    const cx = viewportRef.current.clientWidth / 2;
    const cy = viewportRef.current.clientHeight / 2;

    setCamera((prev) => {
      const nextScale = Math.min(Math.max(prev.scale * factor, MIN_SCALE), MAX_SCALE);
      const ratio = nextScale / prev.scale;
      return {
        scale: nextScale,
        x: cx - (cx - prev.x) * ratio,
        y: cy - (cy - prev.y) * ratio,
      };
    });
  };

  return {
    camera,
    movedRef,
    zoomBy,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onPointerLeave: onPointerUp,
    },
  };
}