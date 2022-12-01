export default class JsonGenerator {
  static statusToJson(status, paused, ontime, activeStream, current_media_type, current_media_id, media){
    return {
      "status": status,
      "pause": paused,
      "ontime": ontime,
      "active_stream": activeStream,
      "active": {
        "type": current_media_type,
        "media_id": current_media_id
      },
      "media": media
    };
  }
}