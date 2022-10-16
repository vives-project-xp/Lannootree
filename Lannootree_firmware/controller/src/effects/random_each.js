import Effect from '../effect.js';
import Debug  from '../debug.js';

export default class RandomEach extends Effect {

  constructor(matrixsize) {
    super(matrixsize);
    this.fade = false;
    this.framespeed_ms = 100;
  }

  nextframe() {
    this.currentmatrix = this.nextmatrix;
    for(var i = 0; i < this.nextmatrix.length; i++) {
      for(var j = 0; j < this.nextmatrix[i].length; j++) {
        this.nextmatrix[i][j].set_color(Math.floor(Math.random()*256),Math.floor(Math.random()*256),Math.floor(Math.random()*256));
      }
    }
    return this.currentmatrix;
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