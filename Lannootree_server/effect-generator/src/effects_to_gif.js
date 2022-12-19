import MatrixParser  from './matrixParser.js';
import { GifFrame, GifUtil } from 'gifwrap';

// Infinite effects:
import RandomEach from './effects/infinite/random_each.js';
import RandomFull from './effects/infinite/random_full.js';
// Finite effects:
import Strobe from './effects/finite/strobe.js';

export default class EffectsToGif {

  generate_gifs(matrixsize, scale_factor) {   // matrixsize is an array: [rows, cols]
    // infinite and finite effects need to be defined here:
    let infinite_effects = [
      new RandomEach(matrixsize),
      new RandomFull(matrixsize)
    ];
    let finite_effects = [
      new Strobe(matrixsize)
    ];
    for (const effect of infinite_effects) {  // Loops over the infinite_effects:
      effect.nextframe();                     // previous, current and next_frame from the effect are still RGB (0,0,0) ... calling nextframe will fill the next_frame, but previous and current are still (0,0,0) 
      let matrix_collection = [];             // matrix_collection stores all the frames (each one is a 2D matrix) for eventually pushing to the 'matrix_to_gif' function to convert the effect to .gif format
      for(var i = 0; i < effect.number_of_frames; i++) {      // each infinite effect has its own number of frames (needs a limit)
        effect.nextframe();                                   // calling next_frame first, so current_frame from the effect will be filled
        matrix_collection.push(effect.get_currentmatrix());   // push the current_frame (2D matrix) to the matrix_collection
        //console.log(MatrixParser.frame_to_string(effect.get_currentmatrix()));
      }
      this.matrix_to_gif(effect.name, effect.framespeed, matrix_collection, matrixsize, scale_factor);  // Each effect will be converted to .gif format with this function 
    }
    for (const effect of finite_effects) {  // Loops over the finite_effects: (same as infinite_effects)
      effect.nextframe();
      let matrix_collection = [];
      while(!effect.endOfEffect()) {
        effect.nextframe();
        matrix_collection.push(effect.get_currentmatrix());
        //console.log(MatrixParser.frame_to_string(effect.get_currentmatrix()));
      }
      this.matrix_to_gif(effect.name, effect.framespeed, matrix_collection, matrixsize, scale_factor);
    }
  }

  matrix_to_gif(filename, framedelay, matrix_collection, matrixsize, scale_factor) {
    const width = matrixsize[1], height = matrixsize[0];  // matrixsize: [rows, cols]
    let total_gif_frames = [];
    for (const matrix of matrix_collection) { // each frame/matrix in the matrix_collection will be checked:
      let frame = new GifFrame(width, height, { delayCentisecs: framedelay });  // framedelay is different for each effect, it will define the speed of each gif (in centiseconds)
      frame.scanAllCoords((x, y, bi) => { // this function will map the matrix to the pixels in the frame of the gif
        frame.bitmap.data[bi] = matrix[x][y].get_red();       // R
        frame.bitmap.data[bi+1] = matrix[x][y].get_green();   // G
        frame.bitmap.data[bi+2] = matrix[x][y].get_blue();    // B
        frame.bitmap.data[bi+3] = 1;                          // A (1 for non-transparant)
      });
      frame.scale(scale_factor);    // The frames can be scaled with a scale_factor (see README for examples)
      total_gif_frames.push(frame); // the gif_frame will be pushed to total_gif_frames
    }
    // When every matrix inside matrix_collection is converted to a collection of gif-frames named total_gif_frames,
    // this function will actually put the gifs on the filesystem with some output in the console
    GifUtil.write(`${filename}_${width*scale_factor}x${height*scale_factor}.gif`, total_gif_frames, { loops: 1 }).then(gif => {
      console.log(`[READY] \t${filename}_${gif.width}x${gif.height}.gif  (frames: ${gif.frames.length}, frame_delay: ${framedelay*10}ms, duration: ${gif.frames.length*(framedelay/100)}s, format: ${width}x${height}px -> ${gif.width}x${gif.height}px, size: ${(gif.buffer.byteLength/1024).toFixed(2)}kB)`);
    });
  }

}