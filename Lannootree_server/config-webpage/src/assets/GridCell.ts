export class GridCell {
  public uuid: string;
  public active: boolean;
  public channel: null | string;
  public connection: null | string | GridCell;
  public coordinate: { col: number, row: number };
  public isHead: boolean;
  public canConnect: boolean;
  public diabled: boolean;
  
  constructor(a: boolean) {
    this.uuid = ''.concat(Math.floor(Math.random() * Date.now()).toString());
    this.active = a;
    this.channel = null;
    this.connection = null;
    this.coordinate = { col: 0, row: 0 };
    this.isHead = false;
    this.canConnect = false;
    this.diabled = false;
  }
};

export type Grid = GridCell[][];
