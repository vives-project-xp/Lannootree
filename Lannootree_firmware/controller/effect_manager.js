export default class EffectManager {

  set_effect(effect) {
    this.current_effect = effect;
  }

  run() {
    if(this.current_effect !== null) return this.current_effect.run();
  }

  get_ledmatrix() {
    this.current_effect.get_ledmatrix();
  }

}