import Color from '../../color.js';
import Effect from '../effect.js';

export default class Strobe extends Effect {

  fade = false;
  framespeed_ms = 1;
  iSOn = false;

  nextframe() {
    let color = 0;
    if (this.iSOn) {
      color = 255;
    }
    else {
      color = 0;
    }
    this.iSOn = !this.iSOn;

    this.currentmatrix = this.generate_matrix(this.nextmatrix);
    for(var i = 0; i < this.nextmatrix.length; i++) {
      for(var j = 0; j < this.nextmatrix[i].length; j++) {
        this.nextmatrix[i][j].set_color(color,color,color);
      }
    }
    return this.currentmatrix;
  }
}