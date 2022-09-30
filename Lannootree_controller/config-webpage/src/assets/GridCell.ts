export default class GridCell {
  public uuid: string;
  public channel: string;
  public active: boolean;
  public coordinate: { col: number, row: number };
  public connection: null | GridCell;

  constructor(a: boolean) {
    this.uuid = ''.concat(Math.floor(Math.random() * Date.now()).toString()); // Pseudo uuid
    this.channel = 'Channel';
    this.active = a;
    this.coordinate = { col: 0, row: 0 };
    this.connection = null;
  }
};
