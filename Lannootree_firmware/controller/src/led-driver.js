import Color from './color.js';

export default class LedDriver {

    constructor(leddriver_connection) {
        this.leddriver_connection = leddriver_connection;
        this.socket = 0;
        if(leddriver_connection) this.socket = net.createConnection("../led_driver/build/dev/lannootree.socket");
    }

    frame_to_ledcontroller() {
        if(this.leddriver_connection) {
          let serializedData = [];
          [].concat(...ledmatrix).forEach(color => {
            serializedData.push(...color.get_color());
          });
          socket.write(Uint8Array.from(serializedData));
        }
      }

}