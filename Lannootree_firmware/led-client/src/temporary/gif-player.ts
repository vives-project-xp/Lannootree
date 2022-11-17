import readGifs from './gifs.js'
import LedDriver from '../driver-connection.js'

const USE_LEDDRIVER_CONNETION = false;
const leddriver = new LedDriver(USE_LEDDRIVER_CONNETION);

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

  async start() {
    this.running = true;


    while (this.running) {
      let frame = 0;
      let Gif: any = this.Gifs[this.current];
      let Frames = Object.keys(Gif);
      this.effectChanged = false;

      while (this.running) {
        while (this.paused) await this.sleep(0);

        leddriver.frame_to_ledcontroller(Gif[Frames[frame]])
        frame = (frame + 1) % Frames.length;

        if (frame == Frames.length - 1 && this.effectChanged) break;

        await this.sleep(50);
      }
    }
  }

  set_gif(index: number) {
    if (index > 0 && index < this.Gifs.length) {
      this.current = index;
      this.effectChanged = true;
    } 
  }

  stop() {
    this.running = false;
  }

  pause() {
    this.paused = true;
  }

  play() {
    this.paused = false;
  }

}

export const gifPlayer = new GifPlayer();
