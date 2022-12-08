#include <json-mqtt-formatter.hpp>

class action_listener : public virtual mqtt::iaction_listener {
  std::string _name;

  void on_failure(const mqtt::token& tok) override {
    std::cout << _name << " failure" << std::endl;
    if (tok.get_message_id() != 0) 
      std::cout << " for token: [" << tok.get_message_id() << "]" << std::endl;
      std::cout << std::endl;
  }

  void on_success(const mqtt::token& tok) override {
    std::cout << _name << " success";
		if (tok.get_message_id() != 0)
			std::cout << " for token: [" << tok.get_message_id() << "]" << std::endl;
		auto top = tok.get_topics();
		if (top && !top->empty())
			std::cout << "\ttoken topic: '" << (*top)[0] << "', ..." << std::endl;
		std::cout << std::endl;
  }

  public:
    action_listener(const std::string& name) : _name(name) {}

};

class callback : public virtual mqtt::callback, public virtual mqtt::iaction_listener {
  int _nretry;
  mqtt::async_client& _cli;
  mqtt::connect_options& _connOpts;
  action_listener _subListener;

  void reconnect(void) {
    std::this_thread::sleep_for(std::chrono::milliseconds(2500));
    try {
      _cli.connect(_connOpts, nullptr, *this);
    } catch(const mqtt::exception& e) {
      std::cerr << "Error: " << e.what() << std::endl;
      exit(1);
    }
  }

  void on_failure(const mqtt::token& tok) override {
		std::cout << "Connection attempt failed" << std::endl;
		if (++_nretry > 10)
			exit(1);
		reconnect();
	}

  void on_success(const mqtt::token& tok) override {
    std::cout << "Success" << std::endl;
  }

  void connected(const std::string& cause) override {
		std::cout << "\nConnection success" << std::endl;
	}

  void connection_lost(const std::string& cause) override {
		std::cout << "\nConnection lost" << std::endl;
		if (!cause.empty())
			std::cout << "\tcause: " << cause << std::endl;

		std::cout << "Reconnecting..." << std::endl;
		_nretry = 0;
		reconnect();
	}

  void message_arrived(mqtt::const_message_ptr msg) override {
		std::cout << "Message arrived" << std::endl;
		std::cout << "\ttopic: '" << msg->get_topic() << "'" << std::endl;
		std::cout << "\tpayload: '" << msg->to_string() << "'\n" << std::endl;
	}

	void delivery_complete(mqtt::delivery_token_ptr token) override {}

  public:
    callback(mqtt::async_client& cli, mqtt::connect_options& connOpts)
          : _nretry(0), _cli(cli), _connOpts(connOpts), _subListener("Subscription") {}

};

namespace Processing {

  JSONMqttFormatter::JSONMqttFormatter(std::string topic) {
    mqtt::async_client client("ssl://lannootree.devbitapp.be:8883", "VoronoizerLiveStream");

    std::stringstream client_cert;
    std::stringstream client_key;

    std::ifstream reader;
    reader.open("../../certs/client/client.crt");
    client_cert << reader.rdbuf();
    reader.close();
    
    reader.open("../../certs/client/client.key");
    client_key << reader.rdbuf();
    reader.close();    

    std::cout << client_cert.str() << std::endl;
    std::cout << client_key.str() << std::endl;

    mqtt::ssl_options sslBuilder;
    sslBuilder.set_ca_path("../../certs/");
    sslBuilder.set_key_store(client_cert.str());
    sslBuilder.set_private_key(client_key.str());

    mqtt::connect_options connOpts;
    connOpts.set_clean_session(false);
    connOpts.set_ssl(sslBuilder);

    callback cb(client, connOpts);
    client.set_callback(cb);

    try {
      client.connect();
    } 
    catch (const mqtt::security_exception& es) {
      std::cout << "Security error: " << es.what() << std::endl;
    }
    catch (const mqtt::exception& e) {
      std::cout << "\nError: Unable to connect to MQTT server : " << e.what() << std::endl;
    } 
  }

  void JSONMqttFormatter::format(std::vector<uint8_t>& cstring, cv::Mat& frame) {

  }

}
