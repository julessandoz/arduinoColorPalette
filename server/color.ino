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
