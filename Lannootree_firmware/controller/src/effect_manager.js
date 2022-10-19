import RandomEach from './effects/random_each.js';
import RandomFull from './effects/random_full.js';

export default class EffectManager {

  current_effect = null;
  current_effect_id = null;
  effects = [
    "random_full",
    "random_each"
  ];

  set_effect(effect_id, matrixsize, speed_modifier) {
    this.current_effect_id = effect_id;
    if(this.current_effect != null) this.current_effect.stop_interval();
    switch(effect_id) {
      case "random_each": this.current_effect = new RandomEach(matrixsize); break;
      case "random_full": this.current_effect = new RandomFull(matrixsize); break;
      default: console.log("unknown effect_id");
    }
    this.current_effect.nextframe();
    this.run(speed_modifier);
  }

  run(speed_modifier) {
    if(this.current_effect != null) this.current_effect.run(speed_modifier);
  }

  pause() {
    if (this.current_effect != null) this.current_effect.stop_interval();
  }
 
  stop() {
    if (this.current_effect != null) this.current_effect.stop_interval();
    this.current_effect = null;
  }

  get_currentmatrix() {
    if(this.current_effect != null) return this.current_effect.get_currentmatrix();
    return null;
  }

  get_nextmatrix() {
    return this.current_effect.get_nextmatrix();
  }

  get_effects() {
    return this.effects;
  }

  get_current_effect() {
    return this.current_effect_id;
  }

  has_effect(effect_id) {
    let effect_found = false;
    this.effects.forEach(effect => {
      if(effect == effect_id) effect_found = true;
    });
    return effect_found;
  }

}