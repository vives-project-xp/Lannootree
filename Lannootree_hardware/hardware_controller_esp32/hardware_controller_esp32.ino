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

#define SECURE_MQTT

#ifdef SECURE_MQTT
#include "esp_tls.h"
static const unsigned char DSTroot_CA[] PROGMEM = R"EOF(
-----BEGIN CERTIFICATE-----
MIIEIzCCAwugAwIBAgIUJx5JUbYCeqeTK804IbAm3n4FnqowDQYJKoZIhvcNAQEL
BQAwgaAxCzAJBgNVBAYTAkJFMQ8wDQYDVQQIDAZCcnVnZ2UxDzANBgNVBAcMBkJy
dWdnZTEOMAwGA1UECgwFVml2ZXMxDjAMBgNVBAsMBVZpdmVzMSAwHgYDVQQDDBds
YW5ub290cmVlLmRldmJpdGFwcC5iZTEtMCsGCSqGSIb3DQEJARYebGFubm9vdHJl
ZS5kZXZidWl0LmJlG1tEG1tEG1tEMB4XDTIyMTAwOTE1MjYxM1oXDTI3MTAwOTE1
MjYxM1owgaAxCzAJBgNVBAYTAkJFMQ8wDQYDVQQIDAZCcnVnZ2UxDzANBgNVBAcM
BkJydWdnZTEOMAwGA1UECgwFVml2ZXMxDjAMBgNVBAsMBVZpdmVzMSAwHgYDVQQD
DBdsYW5ub290cmVlLmRldmJpdGFwcC5iZTEtMCsGCSqGSIb3DQEJARYebGFubm9v
dHJlZS5kZXZidWl0LmJlG1tEG1tEG1tEMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A
MIIBCgKCAQEAxxkpqIxngPI0ji8749nlET/2TzNQg18DmkHfuHyWwjlmKdtinPC6
DD59Vcxfsz5lXGd1dNZ5vsOIwELt99Jq4U5ckKx2ngBPWqQTHwtmPRhRnBklLTfZ
KEP6gXbp+YmV4aH299uixfvI8h//a/TpAhp7Gjt1RkeEwuA0QW8ziIsslvQGAghj
nUTI8Txrj2uE6FXiHbwYz6fTstB5pje3SAVFZM9lBzyzCIrZTph4RlBxL903aR9j
JznIx9avlbBVMbawBz8ENF9z7RV+3GEaDmHP3+A7bdldt7Pb4WVl7puSGe3lrIYG
iv/dJk6xAE7rUb3mT00yaaKBtnR2fyZ62wIDAQABo1MwUTAdBgNVHQ4EFgQUmNAk
xMjJEp02HqwtmDlRUidcoJcwHwYDVR0jBBgwFoAUmNAkxMjJEp02HqwtmDlRUidc
oJcwDwYDVR0TAQH/BAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAQEAdtgRew8KIdF3
0f3BgJsywlS3ZvDxgTFzVcyCuCapslPatS90NBYWkWLsw7MZfQQuFJwyitSUHR+1
dL8+H+cPLZz+Db01/V3xiq+AzMjaWODTeERYj0KJBg7ku4O2BZKMNXTXmmejiCnC
qedYxdHqJmfhJE6mA1nFnKeDHSEklbUxZsV1DoeBhKg7PzKtdEgSOgyVWjoWrQ+T
DxNNlUasPQ7a+Wu63r74ai3EwYqH/ZNrTFWlDjL/dp7uwep8Ca84iNjBCgBKsGB1
Yx5WbB8jkeVOIOJ+UQ/ysFLyd2Em7Vu00nOaqRdI72PA6uSEjbq/yANqRkgW/6l0
LSVWQo95Ng==
-----END CERTIFICATE-----
)EOF";
#endif

esp_mqtt_client_config_t mqtt_cfg;
esp_mqtt_client_handle_t client;

const char* WIFI_SSID = "MY_SSID";
const char* WIFI_PASSWD = "MY_PASS";
const uint8_t newMACAddress[] = {0x32, 0xAE, 0xA4, 0x07, 0x0D, 0x66};

const char* MQTT_HOST = "lannootree.devbitapp.be";
#ifdef SECURE_MQTT
const uint32_t MQTT_PORT = 8883;
#else
const uint32_t MQTT_PORT = 1883;
#endif

volatile int MQTTFlag;

void IRAM_ATTR isr_button_pause() {
  MQTTFlag = 111;
}
void IRAM_ATTR isr_button_play() {
  MQTTFlag = 222;
}
void IRAM_ATTR isr_button_stop() {
  MQTTFlag = 333;
}
void IRAM_ATTR isr_button_gif0() {
  MQTTFlag = 0;
}
void IRAM_ATTR isr_button_gif1() {
  MQTTFlag = 1;
}
void IRAM_ATTR isr_button_gif2() {
  MQTTFlag = 2;
}
void IRAM_ATTR isr_button_gif3() {
  MQTTFlag = 3;
}
void IRAM_ATTR isr_button_gif4() {
  MQTTFlag = 4;
}
void IRAM_ATTR isr_button_gif5() {
  MQTTFlag = 5;
}
void IRAM_ATTR isr_button_gif6() {
  MQTTFlag = 6;
}
void IRAM_ATTR isr_button_gif7() {
  MQTTFlag = 7;
}
void IRAM_ATTR isr_button_gif8() {
  MQTTFlag = 8;
}
void IRAM_ATTR isr_button_gif9() {
  MQTTFlag = 9;
}
void IRAM_ATTR isr_button_gif10() {
  MQTTFlag = 10;
}
void IRAM_ATTR isr_button_gif11() {
  MQTTFlag = 11;
}
void IRAM_ATTR isr_button_gif12() {
  MQTTFlag = 12;
}

void setup () {
	Serial.begin (115200);
  MQTTFlag=-1;
  pinMode(25, INPUT_PULLUP);attachInterrupt(25, isr_button_pause, FALLING);  // button_pause
  pinMode(21, INPUT_PULLUP);attachInterrupt(21, isr_button_play, FALLING);   // button_play
  pinMode(19, INPUT_PULLUP);attachInterrupt(19, isr_button_stop, FALLING);   // button_stop
  pinMode(26, INPUT_PULLUP);attachInterrupt(26, isr_button_gif0, FALLING);   // button_gif0
  pinMode(13, INPUT_PULLUP);attachInterrupt(13, isr_button_gif1, FALLING);   // button_gif1
  pinMode(4, INPUT_PULLUP);attachInterrupt(4, isr_button_gif2, FALLING);     // button_gif2
  pinMode(32, INPUT_PULLUP);attachInterrupt(32, isr_button_gif3, FALLING);   // button_gif3
  pinMode(23, INPUT_PULLUP);attachInterrupt(23, isr_button_gif4, FALLING);   // button_gif4
  pinMode(14, INPUT_PULLUP);attachInterrupt(14, isr_button_gif5, FALLING);   // button_gif5
  pinMode(16, INPUT_PULLUP);attachInterrupt(16, isr_button_gif6, FALLING);   // button_gif6
  pinMode(33, INPUT_PULLUP);attachInterrupt(33, isr_button_gif7, FALLING);   // button_gif7
  pinMode(22, INPUT_PULLUP);attachInterrupt(22, isr_button_gif8, FALLING);   // button_gif8
  pinMode(27, INPUT_PULLUP);attachInterrupt(27, isr_button_gif9, FALLING);   // button_gif9
  pinMode(17, INPUT_PULLUP);attachInterrupt(17, isr_button_gif10, FALLING);  // button_gif10
  pinMode(18, INPUT_PULLUP);attachInterrupt(18, isr_button_gif11, FALLING);  // button_gif11
  pinMode(5, INPUT_PULLUP);attachInterrupt(5, isr_button_gif12, FALLING);    // button_gif12

  // WIFI SETUP
	WiFi.mode (WIFI_MODE_STA);
  esp_wifi_set_mac(WIFI_IF_STA, &newMACAddress[0]);
	WiFi.begin (WIFI_SSID, WIFI_PASSWD);
	while (!WiFi.isConnected ()) {
		Serial.print ('.');
		delay (100);
	}
	Serial.println ();

  // MQTT SETUP
  mqtt_cfg.host = MQTT_HOST;
	mqtt_cfg.port = MQTT_PORT;
	mqtt_cfg.keepalive = 15;
  #ifdef SECURE_MQTT
    mqtt_cfg.transport = MQTT_TRANSPORT_OVER_SSL;
    esp_err_t err = esp_tls_set_global_ca_store (DSTroot_CA, sizeof (DSTroot_CA));
    ESP_LOGI ("TEST","CA store set. Error = %d %s", err, esp_err_to_name(err));
  #else
    mqtt_cfg.transport = MQTT_TRANSPORT_OVER_TCP;
  #endif
	client = esp_mqtt_client_init (&mqtt_cfg);
	err = esp_mqtt_client_start (client);
	ESP_LOGI ("TEST", "Client connect. Error = %d %s", err, esp_err_to_name (err));
}

void loop () {
  if(MQTTFlag >= 0) {
    char* json = "";
    Serial.println(json);
    Serial.println(MQTTFlag);
    switch (MQTTFlag) {
      case 0: json = "{\"command\":\"play_effect\",\"effect_name\":\"0\"}"; break;
      case 1: json = "{\"command\":\"play_effect\",\"effect_name\":\"1\"}"; break;
      case 2: json = "{\"command\":\"play_effect\",\"effect_name\":\"2\"}"; break;
      case 3: json = "{\"command\":\"play_effect\",\"effect_name\":\"3\"}"; break;
      case 4: json = "{\"command\":\"play_effect\",\"effect_name\":\"4\"}"; break;
      case 5: json = "{\"command\":\"play_effect\",\"effect_name\":\"5\"}"; break;
      case 6: json = "{\"command\":\"play_effect\",\"effect_name\":\"6\"}"; break;
      case 7: json = "{\"command\":\"play_effect\",\"effect_name\":\"7\"}"; break;
      case 8: json = "{\"command\":\"play_effect\",\"effect_name\":\"8\"}"; break;
      case 9: json = "{\"command\":\"play_effect\",\"effect_name\":\"9\"}"; break;
      case 10: json = "{\"command\":\"play_effect\",\"effect_name\":\"10\"}"; break;
      case 11: json = "{\"command\":\"play_effect\",\"effect_name\":\"11\"}"; break;
      case 12: json = "{\"command\":\"play_effect\",\"effect_name\":\"12\"}"; break;
      case 111: json = "{\"command\":\"pause\"}"; break;
      case 222: json = "{\"command\":\"play\"}"; break;
      case 333: json = "{\"command\":\"stop\"}"; break;
    }
    Serial.println(json);
    esp_mqtt_client_publish (client, "controller/in", json, 0, 0, false);
    MQTTFlag = -1;
    delay(500);
  }
}
