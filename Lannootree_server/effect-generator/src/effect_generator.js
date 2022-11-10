import RandomEach from './effects/random_each.js';
import RandomFull from './effects/random_full.js';
import Strobe from './effects/strobe.js';

import MatrixParser  from './matrixParser.js';

class EffectGenerator {

  matrixsize = [10, 10];  // [rows, cols]
  endless_effects = [
    new RandomEach(this.matrixsize),
    new RandomFull(this.matrixsize),
    new Strobe(this.matrixsize)
  ];
  other_effects = [];

  generate_frames() {
    for (const effect of this.endless_effects) {
      for(var i = 0; i < 1000; i++) {
        effect.nextframe();
        console.log(MatrixParser.frame_to_string(effect.get_currentmatrix()));
      }
    }
    for (const effect of this.other_effects) {
      for(var i = 0; i < 100; i++) {
        effect.run();
      }
    }
  }

}

const manager = new EffectGenerator;
manager.generate_frames();