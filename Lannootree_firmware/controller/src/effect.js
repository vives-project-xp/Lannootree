export default class Effect {

  constructor(matrixsize) {
    this.currentmatrix = Array.from(Array(Math.abs(matrixsize[0])), () => new Array(Math.abs(matrixsize[1])));
    this.nextmatrix = Array.from(Array(Math.abs(matrixsize[0])), () => new Array(Math.abs(matrixsize[1])));
  }

  get_currentmatrix() {
    return this.currentmatrix;
  }

  get_nextmatrix() {
    return this.nextmatrix;
  }

}