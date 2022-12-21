import Color from './color.js';

// This is the base-class called Effect: all other programmed effect will extend this class
export default class Effect {

  initialFrame = true;  // needed for finite_effects to keep track when they reached the end
  
  // The frames/matrix are split like this, because some effects need to the previous frame to build on for creating the next frame.
  // This is also needed for the Fade class (currently not implemented)
  previousmatrix;       
  currentmatrix;
  nextmatrix;

  constructor(matrixsize) { // This fills the 3 2D-arrays (above) with Color objects set to (0,0,0) based on matrixsize [rows, cols]
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

  // This method generates the same matrix as the oldmatrix, but now its a new Array
  // Otherwise, when you want to shift the matrix like you should like this: this.previousmatrix = this.currentmatrix; ... both previousmatrix and currentmatrix will be changed if you edit only currentmatrix
  // this.previousmatrix = this.generate_matrix(this.currentmatrix); will fix this because it creates a new Array
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