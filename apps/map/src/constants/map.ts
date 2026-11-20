import type { FloorKey } from "../types/venue";

export const VIEWBOX_W = 2000;
export const VIEWBOX_H = 1125;

export const FLOORS: FloorKey[] = ["L1", "L2"];

export const MIN_SCALE = 0.15;
export const MAX_SCALE = 2.5;

// lower = labels appear earlier, higher = later
export const LABEL_BASE_SCALE = 0.55;