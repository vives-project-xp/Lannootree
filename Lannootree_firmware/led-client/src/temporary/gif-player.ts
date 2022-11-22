import readGifs from './gifs.js'
import EventEmitter from 'events';
import { ledDriver } from '../driver-connection.js'

class _GifPlayer extends EventEmitter {

  private Gifs: Object[] = [];
  private currentGif: number = 0;

  constructor() {
    super()
    
    this.Gifs.push(...readGifs().Gifs);
  }

  async loop() {
    let frame = 0;
    let Gif: any = this.Gifs[this.currentGif];
    let Frames: string[] = Object.keys(Gif);

    let running = true;

    let unpause: any = null;
    let pause: any = null;

    this.on('stop',  () => {
      this.emit('play');
      running = false;
    });
    
    this.on('pause', () => {
      if (pause === null) {
        pause = new Promise(res => unpause = res);
      }
    });

    this.on('play',  () => {
      if (unpause !== null) {
        unpause();
        pause = null;
        unpause = null;
      }
    });

    while (running) {
      ledDriver.frame_to_ledcontroller(Gif[Frames[frame]]);
      frame = (frame + 1) % Frames.length;

      if (pause !== null) await pause;

      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  set_gif(index: number) {
    if (index >= 0 && index < this.Gifs.length) {
      this.currentGif = index;
    }
  }

}

class GifPlayer {
  private _gifPlayer: _GifPlayer;

  constructor() {
    this._gifPlayer = new _GifPlayer();
  }

  start() {
    this._gifPlayer.loop();
  }

  stop() {
    this._gifPlayer.emit('stop');
  }

  pause() {
    this._gifPlayer.emit('pause');
  }

  play() {
    this._gifPlayer.emit('play');
  }

  set_gif(index: number) {
    this.stop();
    this._gifPlayer.set_gif(index);
    this.start();
  }

}

export const gifPlayer = new GifPlayer();
