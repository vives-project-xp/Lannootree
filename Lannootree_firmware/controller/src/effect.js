import Color from './color.js';
import Debug  from './debug.js';
import Fade from './fade.js';

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
    this.fade_counter = 0;
    this.running = false;
    this.current_frame = 0;
    this.intervalID = undefined;
    this.stopInterval = false;
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

  run(speed_modifier) {
    if(!this.running) {
      this.running = true;
      this.current_frame = 0;
      this.fade_counter = 0;
      this.intervalID = setInterval(() => {   // frame-interval
        if(this.fade == false || this.fade_counter >= 255) {
          if(this.current_frame >= 255) {
            this.current_frame = 0;
            this.fade_counter = 0;
            console.log(Debug.frame_to_console(this.nextframe()))
          }
        }
        else {
          console.log(Debug.frame_to_console(Fade.calculate_subframe(this.generate_matrix(this.currentmatrix), this.generate_matrix(this.nextmatrix), this.fade_counter)));
          this.fade_counter++;
          console.log(this.fade_counter)
        }
        this.current_frame++;
      }, (Math.round(this.framespeed_ms * speed_modifier)));
    }
  }

}