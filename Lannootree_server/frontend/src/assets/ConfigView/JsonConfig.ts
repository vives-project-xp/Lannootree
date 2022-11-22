import type { GridCell } from "./GridCell";
import type { Coordinate } from "./Panel";

export interface Channel {
  ledCount: number;
  head: undefined | string;
  cells: { uuid: string | undefined; coordinate: Coordinate | undefined; connection: string | undefined } | { uuid: string | undefined; coordinate: Coordinate | undefined; }[];
}

export default interface JsonConfig {
  panelCount: number;
  totalLeds:  number;
  dimentions: Coordinate,
  inUseChannels: string[];
  channels: { [key: string] : Channel };
}
