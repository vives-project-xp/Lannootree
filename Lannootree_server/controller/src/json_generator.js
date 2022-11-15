export default class JsonGenerator {
  static statusToJson(status, activeData, activeStream){
    return {
      "status": status,
      "active_data": activeData,
      "active_stream": activeStream
    };
  }
}