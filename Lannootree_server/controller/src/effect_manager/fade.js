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