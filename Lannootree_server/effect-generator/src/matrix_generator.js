// Infinite effects:
import RandomEach from './effects/infinite/random_each.js';
import RandomFull from './effects/infinite/random_full.js';
// Finite effects:
import Strobe from './effects/finite/strobe.js';

import MatrixParser  from './matrixParser.js';

export default class MatrixGenerator {

  generate_frames(matrixsize) {   // [rows, cols]
    let infinite_effects = [
      new RandomEach(matrixsize),
      new RandomFull(matrixsize)
    ];
    let finite_effects = [
      new Strobe(matrixsize)
    ];
    for (const effect of infinite_effects) {
      for(var i = 0; i < 1000; i++) {
        effect.nextframe();
        console.log(MatrixParser.frame_to_string(effect.get_currentmatrix()));
      }
    }
    for (const effect of finite_effects) {
      while(!effect.endOfEffect()) {
        effect.nextframe();
        console.log(MatrixParser.frame_to_string(effect.get_currentmatrix()));
      }
    }
  }

}