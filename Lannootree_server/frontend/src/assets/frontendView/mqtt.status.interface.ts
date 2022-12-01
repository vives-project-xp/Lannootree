interface MatrixSize {
  type: string;
  media_id: number;
}

// export default interface MqttStatus {
//   matrix_size: MatrixSize;
//   pause: boolean;
//   status: string;
//   fade: boolean;
//   current_effect: string;
//   effects: string[];
//   current_asset: string;
//   assets: string[];
//   color: string;
// }


export default interface MqttStatus {
  status: string;
  pause: boolean;
  ontime: string;
  active_stream: null;
  active: MatrixSize;
  media: string[];
}