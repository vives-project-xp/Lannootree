import type { GridCell } from "./GridCell";
import type { Coordinate } from "./Panel";

export interface Channel {
  ledCount: number;
  head: null | string;
  cells: GridCell[];
}

export default interface JsonConfig {
  panelCount: number;
  totalLeds:  number;
  dimentions: Coordinate,
  inUseChannels: string[];
  channels: { [key: string] : Channel };
}
