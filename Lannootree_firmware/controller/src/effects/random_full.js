import Effect from '../effect.js';

export default class RandomFull extends Effect{

  constructor() {
    this.run();
  }

  run() {
    let red = (Math.random()*256);
    let green = (Math.random()*256);
    let blue = (Math.random()*256);

    super.currentmatrix = this.nextmatrix;
    var nextmatrix = super.nextmatrix;
    for(var i = 0; i < nextmatrix.length; i++) {
      for(var j = 0; j < nextmatrix[i].length; j++) {
        nextmatrix[i][j].set_color(red, green, blue);
      }
    }
    super.nextmatrix = nextmatrix();
    
    return super.currentmatrix;
  }

}