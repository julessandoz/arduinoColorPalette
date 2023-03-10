#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebSrv.h>
#include <SPIFFS.h>
#include <Arduino_APDS9960.h>
#include <Adafruit_NeoPixel.h>
AsyncWebSocket ws("/");
#include "color.h"
#include "env.h"
#include "setup.h"
#define BTN_PIN 32
#define RED_LED 12
#define LUMINOSITYMAX 600

int currentBtnState;
int actionTriggered = false;

void setup() {
  Serial.begin(115200);
  pinMode(BTN_PIN, INPUT_PULLUP);
  pinMode(RED_LED, OUTPUT);
  // Wait for communication with the host computer serial monitor
  while (!Serial) {
    delay(1);
  }
  check_for_APDS();
  setup_wifi(ssid, password);
  if (!check_for_SPIFFS()) return;
  Serial.println(WiFi.localIP());
  setup_server();
}

void send_color(int *r, int *g, int *b, int *a) {
  convertRGB(r, g, b);
  char *hex = rgb_to_hex(*r, *g, *b);
  Serial.println(hex);
  ws.textAll(hex);
}

void loop() {
  while (!APDS.colorAvailable()) delay(5);

  int r, g, b, a;
  APDS.readColor(r, g, b, a);

  if (a < LUMINOSITYMAX) {
    digitalWrite(RED_LED, HIGH);
  } else {
    digitalWrite(RED_LED, LOW);
  }

  currentBtnState = digitalRead(BTN_PIN);
  if (currentBtnState == LOW && !actionTriggered) {
    actionTriggered = true;
    if (a < LUMINOSITYMAX) send_color(&r, &g, &b, &a);
  } else if (currentBtnState == HIGH && actionTriggered) {
    actionTriggered = false;
  }

  delay(50);
}
