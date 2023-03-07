#include <env.h>
#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebSrv.h>
#include <SPIFFS.h>
#include <Arduino_APDS9960.h>
#include <Adafruit_NeoPixel.h>
#ifdef _AVR_
#include <avr/power.h>  // Required for 16 MHz Adafruit Trinket
#endif

// Which pin on the Arduino is connected to the NeoPixels?
// On a Trinket or Gemma we suggest changing this to 1:
#define LED_PIN 33

// How many NeoPixels are attached to the Arduino?
#define LED_COUNT 8

// NeoPixel brightness, 0 (min) to 255 (max)
#define BRIGHTNESS 30  // Set BRIGHTNESS to about 1/5 (max = 255)

// Declare our NeoPixel strip object:
Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

AsyncWebSocket ws("/");

int colors[6][3] = {};
AsyncWebServer server(80);

void parseColors(String inputString, int colors[][3]) {
  int i = 0, j = 0, k = 0;
  char c;
  String numStr;
  for (int n = 0; n < inputString.length(); n++) {
    c = inputString.charAt(n);
    if (c == ',' || c == '|') {
      colors[i][j] = numStr.toInt();
      numStr = "";
      j++;
      if (j >= 3) {
        i++;
        j = 0;
        if (i >= 6) {
          return;
        }
      }
    } else {
      numStr += c;
    }
  }
  if (numStr.length() > 0) {
    colors[i][j] = numStr.toInt();
  }
}

void hexToRGB(String hexColor, uint8_t& r, uint8_t& g, uint8_t& b) {
  // Remove the '#' character if it's present
  if (hexColor[0] == '#') {
    hexColor = hexColor.substring(1);
  }

  // Parse the red, green, and blue values from the hex string
  long number = (long)strtol(hexColor.c_str(), NULL, 16);
  r = number >> 16;
  g = number >> 8 & 0xFF;
  b = number & 0xFF;
}

char* rgb_to_hex(int r, int g, int b) {
  char* hex_str = (char*)malloc(sizeof(char) * 7);
  sprintf(hex_str, "#%02X%02X%02X", r, g, b);
  return hex_str;
}

void onWsEvent(AsyncWebSocket* server, AsyncWebSocketClient* client, AwsEventType type, void* arg, uint8_t* data, size_t len) {
  if (type == WS_EVT_CONNECT) {
    Serial.printf("WebSocket client #%u connected from %s\n", client->id(), client->remoteIP().toString().c_str());
  } else if (type == WS_EVT_DISCONNECT) {
    Serial.printf("WebSocket client #%u disconnected\n", client->id());
  } else if (type == WS_EVT_DATA) {
    String message = "";
    for (size_t i = 0; i < len; i++) {
      message += (char)data[i];
    }

    Serial.printf("WebSocket message received: %s\n", message.c_str());

    parseColors(message.c_str(), colors);
    uint8_t r, g, b;
    strip.clear();
    for (int i = 0; i < 6; i++) {
      strip.setPixelColor(i, strip.Color(colors[i][0], colors[i][1], colors[i][2]));
      strip.show();
    }
    delay(5000);
  }
}
int clamp(int value, int min, int max) {
  return value < min ? min : (value > max ? max : value);
}

void convertRGB(int* r, int* g, int* b) {
  int maxValue = max(max(*r, *g), *b);
  int value = 20;
  int* values[] = { r, g, b };
  for (int i = 0; i < 3; i++) {
    *values[i] = (*r == maxValue) ? clamp(*r + value, 0, 255) : clamp(*r - value, 0, 255);
  }
}

void setup() {
  Serial.begin(115200);

  // Wait for communication with the host computer serial monitor
  while (!Serial) {
    delay(1);
  }

  if (!APDS.begin()) {
    Serial.println("Error initializing APDS-9960 sensor.");
  }


  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  if (!SPIFFS.begin(true)) {
    Serial.println("An error has occurred while mounting SPIFFS");
    return;
  }
  Serial.println("SPIFFS mounted successfully");
  Serial.println(WiFi.localIP());

  server.serveStatic("/", SPIFFS, "/").setDefaultFile("index.html");

  ws.onEvent(onWsEvent);
  server.addHandler(&ws);
  server.begin();
  //ws.textAll("#125025");

  // These lines are specifically to support the Adafruit Trinket 5V 16 MHz.
  // Any other board, you can remove this part (but no harm leaving it):
#if defined(_AVR_ATtiny85_) && (F_CPU == 16000000)
  clock_prescale_set(clock_div_1);
#endif
  // END of Trinket-specific code.

  strip.begin();  // INITIALIZE NeoPixel strip object (REQUIRED)
  strip.show();   // Turn OFF all pixels ASAP  strip.setBrightness(BRIGHTNESS);
}

void loop() {

  while (!APDS.colorAvailable()) {
    delay(5);
  }

  int r, g, b, a;

  APDS.readColor(r, g, b, a);

  if (a < 600) {
    Serial.print("avant r = ");
    Serial.println(r);
    Serial.print("avant g = ");
    Serial.println(g);
    Serial.print("avant b = ");
    Serial.println(b);
    Serial.print("a = ");
    Serial.println(a);
    Serial.println();

    convertRGB(&r, &g, &b);
    char* hex = rgb_to_hex(r, g, b);
    Serial.println(hex);
    ws.textAll(hex);

    Serial.print("r = ");
    Serial.println(r);
    Serial.print("g = ");
    Serial.println(g);
    Serial.print("b = ");
    Serial.println(b);
    Serial.print("a = ");
    Serial.println(a);
    Serial.println();
  }

  delay(5000);
}
