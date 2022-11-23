import { usePanelGrid } from "@/stores/PanelGrid";

export interface Coordinate {
  col: number;
  row: number;
};

export class Panel {
  
  public uuid: string;
  public channel: string;
  public coordinate: Coordinate;
  
  public parentConnection: Panel | null;
  public connection: Panel;

  public canConnect: boolean;
  public disabled: boolean;
  
  constructor(coordinate: Coordinate) {
    const PanelStore = usePanelGrid();

    this.uuid = ''.concat(Math.floor(Math.random() * Date.now()).toString());
    this.channel = PanelStore.currentChannel;
    this.coordinate = coordinate;
    
    this.parentConnection = null;
    this.connection = this;

    this.canConnect = false;
    this.disabled = false;
  }

};
