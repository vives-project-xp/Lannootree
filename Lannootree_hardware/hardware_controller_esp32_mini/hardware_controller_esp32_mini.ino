// SOURCE:
// https://gist.github.com/gmag11/c565a18d361a46993039f8a515e67614#file-mqtt_ssl_idf-ino
// https://www.upesy.com/blogs/tutorials/esp32-pinout-reference-gpio-pins-ultimate-guide

#include "Arduino.h"
#include <WiFi.h>
#include "esp_log.h"
#include "esp_wifi.h"
#include "esp_system.h"
#include "esp_event.h"
#include "mqtt_client.h"

esp_mqtt_client_config_t mqtt_cfg;
esp_mqtt_client_handle_t client;

const char* WIFI_SSID = "MY_SSID";
const char* WIFI_PASSWD = "MY_PASS";
const uint8_t newMACAddress[] = {0x58, 0xCF, 0x79, 0xE3, 0x66, 0x80};

const char* MQTT_HOST = "lannootree.devbitapp.be";
const uint32_t MQTT_PORT = 1883;

volatile int MQTTFlag;
const int LEDPIN = 8;

void IRAM_ATTR isr_button1() {
  MQTTFlag = 1;
}
void IRAM_ATTR isr_button2() {
  MQTTFlag = 2;
}

void setup () {
	Serial.begin (115200);
  MQTTFlag=0;
  pinMode(3, INPUT_PULLUP);attachInterrupt(3, isr_button1, FALLING);
  pinMode(10, INPUT_PULLUP);attachInterrupt(10, isr_button2, FALLING);

  // WIFI SETUP
	WiFi.mode (WIFI_MODE_STA);
  esp_wifi_set_mac(WIFI_IF_STA, &newMACAddress[0]);
	WiFi.begin (WIFI_SSID, WIFI_PASSWD);
  neopixelWrite(LEDPIN,255,0,0);
	while (!WiFi.isConnected ()) {
		Serial.print ('.');
    delay(100);
	}
	Serial.println ();
  neopixelWrite(LEDPIN,0,0,255);

  // MQTT SETUP
  mqtt_cfg.host = MQTT_HOST;
	mqtt_cfg.port = MQTT_PORT;
	mqtt_cfg.keepalive = 15;
  mqtt_cfg.transport = MQTT_TRANSPORT_OVER_TCP;
  esp_err_t err;
	client = esp_mqtt_client_init (&mqtt_cfg);
	err = esp_mqtt_client_start (client);
	ESP_LOGI ("TEST", "Client connect. Error = %d %s", err, esp_err_to_name (err));
  neopixelWrite(LEDPIN,0,255,0);
  delay(500);
  neopixelWrite(LEDPIN,0,0,0);
}

void loop () {
  if(MQTTFlag != 0) {
    char* json = "";
    switch (MQTTFlag) {
      case 1: json = "{\"button\":\"1\"}"; break;
      case 2: json = "{\"button\":\"2\"}"; break;
    }
    Serial.println(json);
    esp_mqtt_client_publish (client, "esp_remote_mini", json, 0, 0, false);
    neopixelWrite(LEDPIN,247,198,0);
    delay(250);
    neopixelWrite(LEDPIN,0,0,0);
    delay(250);
    MQTTFlag = 0;
  }
}
