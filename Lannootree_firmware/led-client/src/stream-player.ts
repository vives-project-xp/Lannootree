import EventEmitter from 'events';
import { ledDriver } from './driver-connection.js';
import { commandOptions, createClient } from 'redis';

class _StreamPlayer extends EventEmitter {

  private redis;

  constructor() {
    super();

    this.redis = createClient({
      url: 'redis://redis:6379'
    });

    this.redis.connect();
  }

  async loop() {
    let running = true;

    let pause: any = null;
    let unpause: any = null;

    this.on('stop', () => {
      this.emit('play');
      // TODO: clear screen
      running = false;
    });    

    this.on('pause', () => {
      if (pause === null) {
        pause = new Promise(res => unpause = res);
      }
    });

    this.on('play', () => {
      if (unpause !== null) {
        unpause();
        pause = null;
        unpause = null;
      }
    });

    while (running) {
      let data = await this.redis.brPop(
        commandOptions({ isolated: false }),
        'frame',
        10
      );

      if (data == null) continue;

      console.log(data.element);

      let next = JSON.parse(data.element.toString());

      if (next !== null) {
        ledDriver.frame_to_ledcontroller(next.frame);
      }

      if (pause != null) await pause;

      await new Promise(resolve => setTimeout(resolve, 40));
    }

    this.removeAllListeners('pause');
    this.removeAllListeners('play');
    this.removeAllListeners('stop');
  }

}

class StreamPlater {
  private _streamPlayer: _StreamPlayer;

  constructor() {
    this._streamPlayer = new _StreamPlayer();
  }

  start() {
    this._streamPlayer.loop();
  }

  stop() {
    this._streamPlayer.emit('stop');
  }

  pause() {
    this._streamPlayer.emit('pause');
  }

  play() {
    this._streamPlayer.emit('play');
  }

  set_stream() {
    this.stop();

    this.start();
  }
}

const streamPlayer = new StreamPlater();
export default streamPlayer;
