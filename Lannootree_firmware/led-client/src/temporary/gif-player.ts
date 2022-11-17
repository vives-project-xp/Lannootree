import readGifs from './gifs.js'
import LedDriver from '../driver-connection.js'

const USE_LEDDRIVER_CONNETION = true;
const leddriver = new LedDriver(USE_LEDDRIVER_CONNETION);

var signal: any = null;
var pauseSignal: any = null;
var cancel: any = null;

class GifPlayer {
  private current = 0;
  private Gifs: Object[] = [];

  constructor() {
    this.Gifs.push(...readGifs()); 
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async loop(cancelSignal: any, pauseSignal: any) {
    let frame = 0;
    let Gif: any = this.Gifs[this.current];
    let Frames = Object.keys(Gif);
    
    let loop = true;
    signal.then(() => loop = false);

    while (loop) {
      leddriver.frame_to_ledcontroller(Gif[Frames[frame]])
      frame = (frame + 1) % Frames.length;      
      await this.sleep(60);
    }
  }

  start() {
    signal = new Promise(resolve => cancel = resolve);
    this.loop(signal, pauseSignal);
  }

  set_gif(index: number) {
    if (index >= 0 && index < this.Gifs.length) {
      this.stop()
      this.current = index;
      this.start()
    } 
  }

  stop() {
    if (cancel !== null) cancel();
    cancel = null;
    signal = null;
  }

}

export const gifPlayer = new GifPlayer();
