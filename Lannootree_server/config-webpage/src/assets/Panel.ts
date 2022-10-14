
export interface Coordinate {
  col: number;
  row: number;
};

export class Panel {
  
  public uuid: string;
  public active: boolean;
  public channel: string;
  public coordinate: Coordinate;
  
  public connection: Panel;

  public canConnect: boolean;
  public disabled: boolean;
  
  constructor(active: boolean) {
    this.active = active;
    this.uuid = ''.concat(Math.floor(Math.random() * Date.now()).toString());
    this.channel = "";
    this.coordinate = { col: 0, row: 0 };
    
    this.connection = this;

    this.canConnect = false;
    this.disabled = false;
  }

};
