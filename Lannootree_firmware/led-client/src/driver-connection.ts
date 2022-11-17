import net from 'net'

export default class LedDriver {

  private leddriver_connection: boolean = false;
  private socket: net.Socket = new net.Socket();

  constructor(leddriver_connection: boolean) {
    this.leddriver_connection = leddriver_connection;
    if (leddriver_connection) this.socket = net.createConnection('../led_driver/build/dev/lannootree.socket');
  }

  frame_to_ledcontroller(data: number[]) {
    if (this.leddriver_connection) {
      this.socket.write(Uint8Array.from(data));
    }
  }

}
