export default class JsonGenerator {
  static statusToJson(argument_array) {
    let obj = new Object();
    
    let matrix_obj = new Object();
    let matrixsize = argument_array[0];
    matrix_obj.rows = matrixsize[0];
    matrix_obj.cols = matrixsize[1];
    obj.matrix = matrix_obj;

    obj.current_effect = argument_array[5];

    let effect_obj = argument_array[2];
    obj.effects = effect_obj;

    obj.current_asset = argument_array[3];

    obj.assets = argument_array[4];

    if(argument_array[5]) obj.pause = "true";
    else obj.pause = "false";

    if(argument_array[5] && argument_array[1] == null && argument_array[3] == null) obj.stop = "true";
    else obj.stop = "false";

    if(argument_array[6] != null) {
      let color_obj = new Object();
      color_obj.red = argument_array[6][0];
      color_obj.green = argument_array[6][1];
      color_obj.blue = argument_array[6][2];
      obj.color = color_obj;
    }
    else obj.color = null;

    return obj;
  }
}