export interface Point {
  x: number;
  y: number;
}

export interface Unit {
  svg_id: string;
  name: string;
  category: string;
  min_zoom: number;
  label_anchor: Point;
}

export interface Entrance {
  anchor_id: string;
  position: Point;
}

export type FloorKey = "L1" | "L2";

export interface Floor {
  short_name: FloorKey;
  units: Unit[];
  entrances: Entrance[];
}

export interface Connection {
  svg_id: string;
  type: "elevator" | "stairs";
  position: Point;
  endpoints: { floor: FloorKey }[];
}

export interface VenueBundle {
  floors: Floor[];
  connections: Connection[];
}

export interface CameraState {
  x: number;
  y: number;
  scale: number;
}

export interface LayerVisibility {
  washrooms: boolean;
  entrances: boolean;
  connectors: boolean;
}