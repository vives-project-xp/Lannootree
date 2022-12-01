interface MatrixSize {
  type: string;
  media_id: number;
}

export default interface MqttStatus {
  status: string;
  pause: boolean;
  ontime: string;
  active_stream: null;
  active: MatrixSize;
  media: any[];
}