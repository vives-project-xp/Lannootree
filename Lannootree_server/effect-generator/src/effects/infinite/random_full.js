import Effect from '../../effect.js';

export default class RandomFull extends Effect {

  //general variables:
  name = "random_full";
  framespeed = 100;  // in hundreds of a second  (100*0.01s = 1s)

  // infinite effects specific variables:
  number_of_frames = 10;

  nextframe() {
    let red = Math.floor(Math.random()*256);
    let green = Math.floor(Math.random()*256);
    let blue = Math.floor(Math.random()*256);

    this.previousmatrix = this.generate_matrix(this.currentmatrix);
    this.currentmatrix = this.generate_matrix(this.nextmatrix);
    for(var i = 0; i < this.nextmatrix.length; i++) {
      for(var j = 0; j < this.nextmatrix[i].length; j++) {
        this.nextmatrix[i][j].set_color(red, green, blue);
      }
    }
    return this.currentmatrix;
  }

}