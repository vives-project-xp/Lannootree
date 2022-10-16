import RandomEach from './effects/random_each.js';
import RandomFull from './effects/random_full.js';

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

  run(speed_modifier) {
    this.current_effect.run(speed_modifier);
  }
}