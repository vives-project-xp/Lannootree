import Effect from '../../effect.js';

export default class Strobe extends Effect {

  fade = false;
  framespeed_ms = 1;
  isOn = false;
  endEffect = false;

  nextframe() {
    let color = 0;
    if (this.isOn) color = 255;
    else color = 0;
    if(this.initialFrame) this.initialFrame = false;
    else {
      if(!this.isOn) this.endEffect = true;
      else this.endEffect = false;
    }
    this.isOn = !this.isOn;

    this.previousmatrix = this.generate_matrix(this.currentmatrix);
    this.currentmatrix = this.generate_matrix(this.nextmatrix);
    for(var i = 0; i < this.nextmatrix.length; i++) {
      for(var j = 0; j < this.nextmatrix[i].length; j++) {
        this.nextmatrix[i][j].set_color(color,color,color);
      }
    }
    return this.currentmatrix;
  }

  endOfEffect() {
    return this.endEffect;
  }

}