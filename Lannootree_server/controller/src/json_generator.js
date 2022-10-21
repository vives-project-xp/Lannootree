export default class JsonGenerator {
  static statusToJson(matrixsize, status, paused, activeData, fade, current_effect, effects, current_asset, assets){

    var active_effect = null;
    var active_asset = null;
    var active_color = null;
    if (status == "effect") active_effect = current_effect;
    if (status == "status") active_asset = current_asset;
    if (status == "color") active_color = activeData;

    return {
      "matrix_size": {
        "rows": matrixsize[0],
        "cols": matrixsize[1]
      },
      "status": status,
      "pause": paused,
      "fade": fade,
      "current_effect": active_effect,
      "effects": effects,
      "current_asset": active_asset,
      "assets": assets,
      "color": active_color
    };
  }
}