import Effect from '../effect.js';

export default class RandomEach extends Effect {

  constructor() {
    this.run();
  }

  run() {
    super.currentmatrix = this.nextmatrix;
    var nextmatrix = super.nextmatrix;
    for(var i = 0; i < nextmatrix.length; i++) {
      for(var j = 0; j < nextmatrix[i].length; j++) {
        nextmatrix[i][j].set_color(Math.floor(Math.random()*256),Math.floor(Math.random()*256),Math.floor(Math.random()*256));
      }
    }
    super.nextmatrix = nextmatrix();
    
    return super.currentmatrix;
  }

}