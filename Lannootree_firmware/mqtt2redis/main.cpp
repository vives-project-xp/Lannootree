#include <thread>
#include <iostream>
#include <signal.h>
#include <mqtt/async_client.h>
#include <sw/redis++/redis++.h>

#include <netdb.h>
#include <arpa/inet.h>

const std::string CLIENT_ID { "lannootreemqqt2redis" };
const std::string TOPIC { "lannootree" };

const int QOS = 1;
const int N_RETRY_ATTEMPTS = 5;

std::unique_ptr<sw::redis::Redis> redis;

bool running = true;

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
		if (++_nretry > N_RETRY_ATTEMPTS)
			exit(1);
		reconnect();
	}

  void on_success(const mqtt::token& tok) override {
    std::cout << "Success" << std::endl;
  }

  void connected(const std::string& cause) override {
		std::cout << "\nConnection success" << std::endl;
		std::cout << "\nSubscribing to topic '" << TOPIC << "'\n"
			<< "\tfor client " << CLIENT_ID
			<< " using QoS" << QOS << "\n" << std::endl;

		_cli.subscribe(TOPIC, QOS, nullptr, _subListener);
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

    redis->lpush(msg->get_topic(), msg->to_string());
	}

	void delivery_complete(mqtt::delivery_token_ptr token) override {}

  public:
    callback(mqtt::async_client& cli, mqtt::connect_options& connOpts)
          : _nretry(0), _cli(cli), _connOpts(connOpts), _subListener("Subscription") {}

};

static void add_sig_handels(void) {
  struct sigaction act;
  memset(&act, '\0', sizeof(act));
  act.sa_sigaction = [](int sig, siginfo_t* info, void* context) { running = 0; };
  act.sa_flags = SA_SIGINFO;
  sigaction(SIGTERM, &act, NULL);
  sigaction(SIGINT, &act, NULL);
  sigaction(SIGKILL, &act, NULL);
}

std::string hostname_to_ip(std::string hostname) {
  struct hostent* he = gethostbyname(hostname.c_str());
  char* ip = inet_ntoa(*(struct in_addr*)he->h_addr_list[0]);
  return std::string(ip);
}

int main(int argc, char* argv[]) {
  try {
    std::string MQTT_SERVER_ADDR  = argv[1];
    std::string MQTT_SERVER_PORT  = argv[2];
    std::string REDIS_SERVER_ADDR = argv[3];
    std::string REDIS_SERVER_PORT = argv[4];

    std::string FULL_MQTT_ADDR  = "tcp://" + hostname_to_ip(MQTT_SERVER_ADDR) + ":" + MQTT_SERVER_PORT;
    std::string FULL_REDIS_ADDR = "tcp://" + hostname_to_ip(REDIS_SERVER_ADDR) + ":" + REDIS_SERVER_PORT;

    redis = std::make_unique<sw::redis::Redis>(sw::redis::Redis(FULL_REDIS_ADDR));

    mqtt::async_client cli(FULL_MQTT_ADDR, CLIENT_ID);

    mqtt::connect_options connOpts;
    connOpts.set_clean_session(false);

    callback cb(cli, connOpts);
    cli.set_callback(cb);

    try {
      std::cout << "Connecting to MQTT server..." << std::endl;
      cli.connect();
    } catch (const mqtt::exception& e) {
      std::cerr << "\nError: Unable to connect to MQTT server: "
        << FULL_MQTT_ADDR << "'" << e << std::endl;
      return 1;
    }

    add_sig_handels();

    while (running);

    std::cout << "\nDisconnecting from the MQTT server..." << std::flush;
    cli.disconnect()->wait();
    std::cout << "OK" << std::endl;

  } catch(const sw::redis::Error& e) {
    std::cerr << e.what() << std::endl;
    return 1;
  } catch (const mqtt::exception& exc) {
    std::cerr << exc << std::endl;
    return 2;
  }

  return 0;
}
