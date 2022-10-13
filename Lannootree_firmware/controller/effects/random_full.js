import Effect from '../effect.js';

export default class RandomFull extends Effect{

  constructor(ledmatrix) {
    super(ledmatrix);
  }

  run() {
    this.#set_color_full(
      Math.floor(Math.random()*256), 
      Math.floor(Math.random()*256), 
      Math.floor(Math.random()*256)
    );
    return super.get_ledmatrix();
  }

  #set_color_full(red, green, blue) {
    var matrix = super.get_ledmatrix();
    if(!isNaN(red) && !isNaN(green) && !isNaN(blue)) {
      if(red<=255 && green<=255 && blue<=255 && red>=0 && green>=0 && blue>=0) {
        for(var i = 0; i < matrix.length; i++) {
          for(var j = 0; j < matrix[i].length; j++) {
            matrix[i][j].set_color(red, green, blue);
          }
        }
      }
    }
    super.set_ledmatrix(matrix);
  }

}