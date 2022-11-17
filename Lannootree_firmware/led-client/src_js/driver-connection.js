import net from "net";

export default class LedDriver {

  constructor(leddriver_connection) {
    this.leddriver_connection = leddriver_connection;
    this.socket = 0;
    if(leddriver_connection) this.socket = net.createConnection("../led_driver/build/dev/lannootree.socket");
  }

  frame_to_ledcontroller(data) {
    if(this.leddriver_connection) {
      let serializedData = [];
      [].concat(...data).forEach(color => {
        serializedData.push(color.red);
        serializedData.push(color.green);
        serializedData.push(color.blue);
      });
      serializedData.splice(serializedData.length - (9 * 4 * 3), serializedData.length);
      this.socket.write(Uint8Array.from(serializedData));
    }
  }

}