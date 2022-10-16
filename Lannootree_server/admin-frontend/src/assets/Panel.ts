
export interface Coordinate {
  col: number;
  row: number;
};

export class Panel {
  
  public uuid: string;
  public channel: string;
  public coordinate: Coordinate;
  
  public connection: Panel;

  public canConnect: boolean;
  public disabled: boolean;
  
  constructor(coordinate: Coordinate) {
    this.uuid = ''.concat(Math.floor(Math.random() * Date.now()).toString());
    this.channel = "CA0";
    this.coordinate = coordinate;
    
    this.connection = this;

    this.canConnect = false;
    this.disabled = false;
  }

};
