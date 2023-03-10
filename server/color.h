#ifndef COLOR_H
#define COLOR_H

void hexToRGB(String hexColor, uint8_t& r, uint8_t& g, uint8_t& b); 

char* rgb_to_hex(int r, int g, int b);

void parseColors(String inputString, int colors[][3]); 

int clamp(int value, int min, int max); 

void convertRGB(int* r, int* g, int* b); 

#endif //COLOR_H