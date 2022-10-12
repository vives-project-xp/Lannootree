import Effect from './effect.js';

export default class RandomEach extends Effect{

  constructor(ledmatrix) {
    super(ledmatrix);
  }

  run() {
    var matrix = super.get_ledmatrix();
    for(var i = 0; i < matrix.length; i++) {
      for(var j = 0; j < matrix[i].length; j++) {
        matrix[i][j].set_color(Math.floor(Math.random()*256),Math.floor(Math.random()*256),Math.floor(Math.random()*256));
      }
    }
    super.set_ledmatrix(matrix);
    return super.get_ledmatrix();
  }

}