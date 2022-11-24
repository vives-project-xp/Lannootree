//import MatrixParser  from './matrixParser.js';
import { GifFrame, GifUtil } from 'gifwrap';

// Infinite effects:
import RandomEach from './effects/infinite/random_each.js';
import RandomFull from './effects/infinite/random_full.js';
// Finite effects:
import Strobe from './effects/finite/strobe.js';

export default class EffectsToGif {

  generate_gifs(matrixsize, scale_factor) {   // [rows, cols]
    let infinite_effects = [
      new RandomEach(matrixsize),
      new RandomFull(matrixsize)
    ];
    let finite_effects = [
      new Strobe(matrixsize)
    ];
    for (const effect of infinite_effects) {
      effect.nextframe();
      let matrix_collection = [];
      for(var i = 0; i < effect.number_of_frames; i++) {
        effect.nextframe();
        matrix_collection.push(effect.get_currentmatrix());
        //console.log(MatrixParser.frame_to_string(effect.get_currentmatrix()));
      }
      this.matrix_to_gif(effect.name, effect.framespeed, matrix_collection, matrixsize, scale_factor);
    }
    for (const effect of finite_effects) {
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
    const width = matrixsize[1], height = matrixsize[0];
    let total_gif_frames = [];
    for (const matrix of matrix_collection) {
      let frame = new GifFrame(width, height, { delayCentisecs: framedelay });
      frame.scanAllCoords((x, y, bi) => {
        frame.bitmap.data[bi] = matrix[x][y].get_red();
        frame.bitmap.data[bi+1] = matrix[x][y].get_green();
        frame.bitmap.data[bi+2] = matrix[x][y].get_blue();
        frame.bitmap.data[bi+3] = 1;
      });
      frame.scale(scale_factor);
      total_gif_frames.push(frame);
    }
    GifUtil.write(`${filename}.gif`, total_gif_frames, { loops: 1 }).then(gif => {
      console.log(`READY:\t${filename}.gif  (frames: ${gif.frames.length}, frame_delay: ${framedelay*10}ms, duration: ${gif.frames.length*(framedelay/100)}s, format: ${width}x${height}px -> ${gif.width}x${gif.height}px, size: ${(gif.buffer.byteLength/1024).toFixed(2)}kB)`);
    });
  }

}