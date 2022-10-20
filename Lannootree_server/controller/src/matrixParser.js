export default class MatrixParser {

  static frame_to_string(frame) {
    var frame_console = "";
    for(var i = 0; i < frame.length; i++) {
      for(var j = 0; j < frame[i].length; j++) {
        frame_console+=`(${frame[i][j].get_red()},${frame[i][j].get_green()},${frame[i][j].get_blue()})`;
      }
      frame_console+="\n";
    }
    return frame_console;
  }
  
  static frame_to_json(frame) {
    var frame_json = [];
    for(var i = 0; i < frame.length; i++) {
      frame_json[i] = [];
      for(var j = 0; j < frame[i].length; j++) {
        frame_json[i][j] = new Object();
        frame_json[i][j].red = frame[i][j].get_red();
        frame_json[i][j].green = frame[i][j].get_green();
        frame_json[i][j].blue = frame[i][j].get_blue();
      }
    }
    return frame_json;
  }

}