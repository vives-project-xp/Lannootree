import readGifs from './gifs.js'
import LedDriver from '../driver-connection.js'

const USE_LEDDRIVER_CONNETION = true;
const leddriver = new LedDriver(USE_LEDDRIVER_CONNETION);

var cancel: any = null;
var signal: any = null;

class GifPlayer {
  private current = 0;
  private Gifs: Object[] = [];

  constructor() {
    this.Gifs.push(...readGifs()); 
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async loop(signal: any) {
    let frame = 0;
    let Gif: any = this.Gifs[this.current];
    let Frames = Object.keys(Gif);

    let loop = true;
    signal.then(() => loop = false);

    console.log("starting loop")

    while (loop) {
      leddriver.frame_to_ledcontroller(Gif[Frames[frame]])
      frame = (frame + 1) % Frames.length;

      await this.sleep(50);
    }

    console.log("loop stoped");
  }

  start() {
    signal = new Promise(resolve => cancel = resolve);
    this.loop(signal);
  }

  set_gif(index: number) {
    if (index > 0 && index < this.Gifs.length) {
      this.stop();
      this.current = index;
      this.start();
    } 
  }

  stop() {
    if (cancel !== null) cancel();
  }

  pause() {
    console.log("pause gif")
  }

  play() {
    console.log("play gif")
  }

}

export const gifPlayer = new GifPlayer();
