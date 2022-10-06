import type GridCell from "./GridCell";

export interface Channel {
  ledCount: number;
  head: null | string;
  cells: GridCell[];
}

export default interface JsonConfig {
  panelCount: number;
  totalLeds:  number;
  inUseChannels: string[];
  channels: { [key: string] : Channel };
}
