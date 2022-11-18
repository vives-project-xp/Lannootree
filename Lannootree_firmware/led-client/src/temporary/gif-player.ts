import readGifs from './gifs.js'
import LedDriver from '../driver-connection.js'

const USE_LEDDRIVER_CONNETION = true;
const leddriver = new LedDriver(USE_LEDDRIVER_CONNETION);

var cancel: any;
var signal: any;

class GifPlayer {
  private current = 0;
  private Gifs: Object[] = [];
  private running: boolean = false;
  private paused: boolean = false;
  private effectChanged: boolean = false;

  constructor() {
    this.Gifs.push(...readGifs()); 
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async loop() {
    let frame = 0;
    let Gif: any = this.Gifs[this.current];
    let Frames = Object.keys(Gif);

    let loop = true;
    signal.then(() => loop = false);

    while (loop) {
      leddriver.frame_to_ledcontroller(Gif[Frames[frame]])
      frame = (frame + 1) % Frames.length;

      await this.sleep(50);
    }
  }

  start() {
    signal = new Promise(resolve => cancel = resolve);
    this.loop();
  }

  set_gif(index: number) {
    this.stop();
    if (index > 0 && index < this.Gifs.length) {
      this.current = index;
      this.effectChanged = true;
    } 
    this.start();
  }

  stop() {
    cancel();
  }

  pause() {
    console.log("pause gif")
  }

  play() {
    console.log("play gif")
  }

}

export const gifPlayer = new GifPlayer();
