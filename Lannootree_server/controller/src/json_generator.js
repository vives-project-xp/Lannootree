export default class JsonGenerator {
  static statusToJson(status, paused, ontime, activeStream, current_media_id, media){
    return {
      "status": status,
      "pause": paused,
      "ontime": ontime,
      "active_stream": activeStream,
      "active": {
        "media_id": current_media_id
      },
      "media": media
    };
  }
}