export default class Debug {

  static frame_to_console(frame) {
    var frame_console = "";
    for(var i = 0; i < frame.length; i++) {
      for(var j = 0; j < frame[i].length; j++) {
        frame_console+=`(${frame[i][j].get_red()},${frame[i][j].get_green()},${frame[i][j].get_blue()})` 
      }
      frame_console+="\n";
    }
    return frame_console;
  }

}