import Effect from '../../effect.js';

export default class RandomEach extends Effect {

  //general variables:
  name = "random_each";
  framespeed = 10;  // in hundreds of a second  (10*0.01s = 0.1s = 100ms)

  // infinite effects specific variables:
  number_of_frames = 100;

  nextframe() {
    this.previousmatrix = this.generate_matrix(this.currentmatrix);
    this.currentmatrix = this.generate_matrix(this.nextmatrix);
    for(var i = 0; i < this.nextmatrix.length; i++) {
      for(var j = 0; j < this.nextmatrix[i].length; j++) {
        this.nextmatrix[i][j].set_color(Math.floor(Math.random()*256),Math.floor(Math.random()*256),Math.floor(Math.random()*256));
      }
    }
    return this.currentmatrix;
  }
}