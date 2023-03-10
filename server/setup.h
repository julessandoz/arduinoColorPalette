#ifndef SETUP_H
#define SETUP_H

void onWsEvent(AsyncWebSocket* server, AsyncWebSocketClient* client, AwsEventType type, void* arg, uint8_t* data, size_t len);

void check_for_APDS();

void setup_wifi(const char *ssid, const char *password);

bool check_for_SPIFFS();

void setup_server();

#endif  //SETUP_H