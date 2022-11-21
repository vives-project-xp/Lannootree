import Color from './color.js';

export default class Effect {

  initialFrame = true;
  previousmatrix;
  currentmatrix;
  nextmatrix;

  constructor(matrixsize) {
    this.previousmatrix = Array.from(Array(Math.abs(matrixsize[0])), () => new Array(Math.abs(matrixsize[1])));
    this.currentmatrix = Array.from(Array(Math.abs(matrixsize[0])), () => new Array(Math.abs(matrixsize[1])));
    this.nextmatrix = Array.from(Array(Math.abs(matrixsize[0])), () => new Array(Math.abs(matrixsize[1])));
    for(var i = 0; i < this.currentmatrix.length; i++) {
      for(var j = 0; j < this.currentmatrix[i].length; j++) {
        this.previousmatrix[i][j] = new Color(0,0,0);
        this.currentmatrix[i][j] = new Color(0,0,0);
        this.nextmatrix[i][j] = new Color(0,0,0);
      }
    }
  }

  get_previousmatrix() {
    return this.previousmatrix;
  }

  get_currentmatrix() {
    return this.currentmatrix;
  }

  get_currentmatrix() {
    return this.currentmatrix;
  }

  get_nextmatrix() {
    return this.nextmatrix;
  }

  get_matrixsize(matrix) {
    let rows = 0;
    let cols = 0;
    if(matrix.length != 0) {
      cols = matrix[0].length;
      for(var i = 0; i < matrix.length; i++) rows++;
    }
    return [rows, cols];
  }

  generate_matrix(oldmatrix) {
    let newmatrix = Array.from(Array(Math.abs(this.get_matrixsize(oldmatrix)[0])), () => new Array(Math.abs(this.get_matrixsize(oldmatrix)[1])));
    for(var i = 0; i < newmatrix.length; i++) {
      for(var j = 0; j < newmatrix[i].length; j++) {
        newmatrix[i][j] = new Color(oldmatrix[i][j].get_red(), oldmatrix[i][j].get_green(), oldmatrix[i][j].get_blue());
      }
    }
    return newmatrix;
  }

}