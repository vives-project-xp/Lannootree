import Color from './color.js';

export default class Effect {

  constructor(matrixsize) {
    this.currentmatrix = Array.from(Array(Math.abs(matrixsize[0])), () => new Array(Math.abs(matrixsize[1])));
    this.nextmatrix = Array.from(Array(Math.abs(matrixsize[0])), () => new Array(Math.abs(matrixsize[1])));
    for(var i = 0; i < this.currentmatrix.length; i++) {
      for(var j = 0; j < this.currentmatrix[i].length; j++) {
        this.currentmatrix[i][j] = new Color(0,0,0);
        this.nextmatrix[i][j] = new Color(0,0,0);
      }
    }
    this.fade_counter = 0;
    this.running = false;
  }

  get_currentmatrix() {
    return this.currentmatrix;
  }

  get_nextmatrix() {
    return this.nextmatrix;
  }

  run(speed_modifier) {
    if(!this.running) {
      this.running = true;
      setInterval(() => {   // frame-interval
        if(this.fade == false) {
          this.fade_counter = 0;
          console.log(Debug.frame_to_console(this.nextframe()))
        }
        // else {
        //   if(this.fade_counter == 0) {
        //     previous_frame = ledmatrix;
        //     next_frame = manager.run();
        //     next_frame = manager.run();
        //     console.log("HALLO");
        //     console.log("PREVIOUS:");
        //     Debug.frame_to_console(ledmatrix);
        //     console.log("NEXT:");
        //     Debug.frame_to_console(manager.run());
  
        //     enable_subframes = true;
        //   }
        // }
      }, (Math.round(this.framespeed_ms * speed_modifier)));
  
      // setInterval(() => {   // fade-interval
      //   if(this.fade_counter == 255) {
      //     this.fade_counter = 0;
      //     enable_subframes = false;
      //   }
      //   if(enable_subframes == true) {
      //     let subframe = Fade.calculate_subframe(previous_frame, next_frame, fade_counter);
      //     //frame_to_ledcontroller();
      //     console.log("PREVIOUS:");
      //     Debug.frame_to_console(previous_frame);
      //     console.log("SUB:");
      //     Debug.frame_to_console(subframe);
      //     console.log("NEXT:");
      //     Debug.frame_to_console(next_frame);
      //     console.log(this.fade_counter);
      //     this.fade_counter++;
      //   }
      // }, 100);

    }
  }

}