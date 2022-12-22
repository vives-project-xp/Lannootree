/*
This class isn't being used currently in the project, but it's ready to be implemented.
It enables a fade effect between 2 given frames previous/next-frame (form of matrix).
Based on the fade_counter (0 to 255), it calculates the right RGB value for each 'pixel/cell' in the matrix.
An effect can for example generate the next_frame, but instead of instantly 'jumping' to that new frame, it will go in 255 steps ... creating a fade between 2 given frames
*/

export default class Fade {

  static calculate_subframe(previous_frame, next_frame, fade_counter) {
    let subframe = previous_frame;
    for(var i = 0; i < subframe.length; i++) {
      for(var j = 0; j < subframe[i].length; j++) {
        subframe[i][j].set_color(
          Math.round(previous_frame[i][j].get_red() + ((next_frame[i][j].get_red() - previous_frame[i][j].get_red()) * (fade_counter/255))),
          Math.round(previous_frame[i][j].get_green() + ((next_frame[i][j].get_green() - previous_frame[i][j].get_green()) * (fade_counter/255))),
          Math.round(previous_frame[i][j].get_blue() + ((next_frame[i][j].get_blue() - previous_frame[i][j].get_blue()) * (fade_counter/255)))
        );
      }
    }
    return subframe;
  }

}