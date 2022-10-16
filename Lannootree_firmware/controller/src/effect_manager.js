import RandomEach from './effects/random_each.js';
import RandomFull from './effects/random_full.js';

import Debug  from './debug.js';

export default class EffectManager {

  set_effect(effect_id, matrixsize) {
    switch(effect_id) {
      case "random_each": this.current_effect = new RandomEach(matrixsize); break;
      case "random_full": this.current_effect = new RandomFull(matrixsize); break;
      default: console.log("unknown effect_id");
    }
    this.current_effect.nextframe();
  }

  get_currentmatrix() {
    return this.current_effect.get_currentmatrix();
  }

  get_nextmatrix() {
    return this.current_effect.get_nextmatrix();
  }

  get_effects() {
    return [
      "random_full",
      "random_each"
    ];
  }

  fade_counter = 0;
  fade = false;

  run() {
    // let enable_subframes = false;

    setInterval(() => {   // frame-interval
        if(this.fade == false) {
          this.fade_counter = 0;
          console.log(Debug.frame_to_console(this.current_effect.nextframe()))
        }
        else {
          if(this.fade_counter == 0) {
            previous_frame = ledmatrix;
            next_frame = manager.run();
            next_frame = manager.run();
            console.log("HALLO");
            console.log("PREVIOUS:");
            Debug.frame_to_console(ledmatrix);
            console.log("NEXT:");
            Debug.frame_to_console(manager.run());

            enable_subframes = true;
          }
        }
    }, (2000));

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