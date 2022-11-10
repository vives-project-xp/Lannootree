interface MatrixSize {
  rows: number;
  cols: number;
}

export default interface MqttStatus {
  matrix_size: MatrixSize;
  pause: boolean;
  status: string;
  fade: boolean;
  current_effect: string;
  effects: string[];
  current_asset: string;
  assets: string[];
  color: string;
}
