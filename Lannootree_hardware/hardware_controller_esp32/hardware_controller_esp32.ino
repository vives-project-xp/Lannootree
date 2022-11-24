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
const int LEDPIN = 2;

void IRAM_ATTR isr_button1() {
  MQTTFlag = 1;
}
void IRAM_ATTR isr_button2() {
  MQTTFlag = 2;
}
void IRAM_ATTR isr_button3() {
  MQTTFlag = 3;
}
void IRAM_ATTR isr_button4() {
  MQTTFlag = 4;
}
void IRAM_ATTR isr_button5() {
  MQTTFlag = 5;
}
void IRAM_ATTR isr_button6() {
  MQTTFlag = 6;
}
void IRAM_ATTR isr_button7() {
  MQTTFlag = 7;
}
void IRAM_ATTR isr_button8() {
  MQTTFlag = 8;
}
void IRAM_ATTR isr_button9() {
  MQTTFlag = 9;
}
void IRAM_ATTR isr_button10() {
  MQTTFlag = 10;
}
void IRAM_ATTR isr_button11() {
  MQTTFlag = 11;
}
void IRAM_ATTR isr_button12() {
  MQTTFlag = 12;
}
void IRAM_ATTR isr_button13() {
  MQTTFlag = 13;
}
void IRAM_ATTR isr_button14() {
  MQTTFlag = 14;
}
void IRAM_ATTR isr_button15() {
  MQTTFlag = 15;
}
void IRAM_ATTR isr_button16() {
  MQTTFlag = 16;
}

void setup () {
	Serial.begin (115200);
  MQTTFlag=0;
  pinMode(13, INPUT_PULLUP);attachInterrupt(13, isr_button1, FALLING);
  pinMode(4, INPUT_PULLUP);attachInterrupt(4, isr_button2, FALLING);
  pinMode(32, INPUT_PULLUP);attachInterrupt(32, isr_button3, FALLING);
  pinMode(23, INPUT_PULLUP);attachInterrupt(23, isr_button4, FALLING);
  pinMode(14, INPUT_PULLUP);attachInterrupt(14, isr_button5, FALLING);
  pinMode(16, INPUT_PULLUP);attachInterrupt(16, isr_button6, FALLING);
  pinMode(33, INPUT_PULLUP);attachInterrupt(33, isr_button7, FALLING);
  pinMode(22, INPUT_PULLUP);attachInterrupt(22, isr_button8, FALLING);
  pinMode(27, INPUT_PULLUP);attachInterrupt(27, isr_button9, FALLING);
  pinMode(17, INPUT_PULLUP);attachInterrupt(17, isr_button10, FALLING);
  pinMode(18, INPUT_PULLUP);attachInterrupt(18, isr_button11, FALLING);
  pinMode(5, INPUT_PULLUP);attachInterrupt(5, isr_button12, FALLING);
  pinMode(26, INPUT_PULLUP);attachInterrupt(26, isr_button13, FALLING);
  pinMode(19, INPUT_PULLUP);attachInterrupt(19, isr_button14, FALLING);
  pinMode(25, INPUT_PULLUP);attachInterrupt(25, isr_button15, FALLING);
  pinMode(21, INPUT_PULLUP);attachInterrupt(21, isr_button16, FALLING);

  // LED
  pinMode(LEDPIN, OUTPUT);
  digitalWrite(LEDPIN, LOW);
  
  // WIFI SETUP
	WiFi.mode (WIFI_MODE_STA);
  esp_wifi_set_mac(WIFI_IF_STA, &newMACAddress[0]);
	WiFi.begin (WIFI_SSID, WIFI_PASSWD);
	while (!WiFi.isConnected ()) {
		Serial.print ('.');
    digitalWrite(LEDPIN, HIGH);
    delay(100);
    digitalWrite(LEDPIN, LOW);
    delay(100);
	}
	Serial.println ();

  // MQTT SETUP
  mqtt_cfg.host = MQTT_HOST;
	mqtt_cfg.port = MQTT_PORT;
	mqtt_cfg.keepalive = 15;
  mqtt_cfg.transport = MQTT_TRANSPORT_OVER_TCP;
  esp_err_t err;
	client = esp_mqtt_client_init (&mqtt_cfg);
	err = esp_mqtt_client_start (client);
	ESP_LOGI ("TEST", "Client connect. Error = %d %s", err, esp_err_to_name (err));
  digitalWrite(LEDPIN, HIGH);
  delay(500);
  digitalWrite(LEDPIN, LOW);
  delay(500);
  digitalWrite(LEDPIN, HIGH);
  delay(500);
  digitalWrite(LEDPIN, LOW);
  delay(500);
}

void loop () {
  if(MQTTFlag != 0) {
    char* json = "";
    switch (MQTTFlag) {
      case 1: json = "{\"button\":\"1\"}"; break;
      case 2: json = "{\"button\":\"2\"}"; break;
      case 3: json = "{\"button\":\"3\"}"; break;
      case 4: json = "{\"button\":\"4\"}"; break;
      case 5: json = "{\"button\":\"5\"}"; break;
      case 6: json = "{\"button\":\"6\"}"; break;
      case 7: json = "{\"button\":\"7\"}"; break;
      case 8: json = "{\"button\":\"8\"}"; break;
      case 9: json = "{\"button\":\"9\"}"; break;
      case 10: json = "{\"button\":\"10\"}"; break;
      case 11: json = "{\"button\":\"11\"}"; break;
      case 12: json = "{\"button\":\"12\"}"; break;
      case 13: json = "{\"button\":\"13\"}"; break;
      case 14: json = "{\"button\":\"14\"}"; break;
      case 15: json = "{\"button\":\"15\"}"; break;
      case 16: json = "{\"button\":\"16\"}"; break;
    }
    Serial.println(json);
    esp_mqtt_client_publish (client, "esp_remote", json, 0, 0, false);
    digitalWrite(LEDPIN, HIGH);
    delay(250);
    digitalWrite(LEDPIN, LOW);
    delay(250);
    MQTTFlag = 0;
  }
}
