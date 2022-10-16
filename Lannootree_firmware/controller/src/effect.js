import Color from './color.js';

export default class Effect {

  constructor(matrixsize) {
    this.currentmatrix = Array.from(Array(Math.abs(matrixsize[0])), () => new Array(Math.abs(matrixsize[1])));
    this.nextmatrix = Array.from(Array(Math.abs(matrixsize[0])), () => new Array(Math.abs(matrixsize[1])));
    for(var i = 0; i < this.currentmatrix.length; i++) {
      for(var j = 0; j < this.currentmatrix[i].length; j++) {
        this.currentmatrix[i][j] = new Color(0,0,0);
        this.nextmatrix[i][j] = new Color(0,0,0);
      }
    }
  }

  get_currentmatrix() {
    return this.currentmatrix;
  }

  get_nextmatrix() {
    return this.nextmatrix;
  }

}