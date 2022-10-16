import Effect from '../effect.js';

export default class RandomFull extends Effect{

  // constructor() {
  //   //this.run();
  // }

  run() {
    let red = Math.floor(Math.random()*256);
    let green = Math.floor(Math.random()*256);
    let blue = Math.floor(Math.random()*256);

    this.currentmatrix = this.nextmatrix;
    for(var i = 0; i < this.nextmatrix.length; i++) {
      for(var j = 0; j < this.nextmatrix[i].length; j++) {
        this.nextmatrix[i][j].set_color(red, green, blue);
      }
    }
    
    return this.currentmatrix;
  }

}