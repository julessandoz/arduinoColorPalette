# ArduinoColorPalette

ArduinoColorPalette est un projet étudiant réalisé à deux dans le cadre du cours Arduino de la Haute École d'Ingénierie et de Gestion du Canton de Vaud (Suisse).   

Il s'agit d'un capteur permettant de générer une palette 6 couleurs à partir de la couleur détectée capteur. Le dispositif embarque un serveur web qui permet de servir une interface utilisateur pour afficher les couleurs générer par la palette ainsi que de changer de mode de couleur parmi analogue, triadique et complémentaire. La palette de couleur générée est alors renvoyée au serveur afin d'afficher la palette au moyen de LED RGB présente sur le dispositif.

[Le dispositif final](capture.png)

# Summary

- [ArduinoColorPalette](#arduinocolorpalette)
- [Summary](#summary)
- [Reproduire le projet](#reproduire-le-projet)
  - [1. Réaliser le circuit Arduino au moyen du plan fournis](#1-réaliser-le-circuit-arduino-au-moyen-du-plan-fournis)
  - [2. Construire l'interface](#2-construire-linterface)
  - [3. Installer les libraires arduino suivantes](#3-installer-les-libraires-arduino-suivantes)
  - [4. Upload les fichiers statiques sur l'arduino](#4-upload-les-fichiers-statiques-sur-larduino)
  - [5. Connecter le serveur web au wifi](#5-connecter-le-serveur-web-au-wifi)
  - [6. Compilation et upload](#6-compilation-et-upload)
- [Informations complémentaire sur le projet](#informations-complémentaire-sur-le-projet)

# Reproduire le projet

⚠️  Les exemples de code suivant partent du principe que l'installation se fait sur macOS au moyen du shell bash, sur un autre système les étapes et noms des dossiers peuvent un peu varier. De plus la plus part des étapes demandent d'utiliser l'interface graphique de l'IDE Arduino. Il est biensur possible de réaliser toutes les étapes uniquement à la ligne de commande si vous savez ce que vous faites.

De plus il recommandé de disposer de deux version de l'IDE Arduino. 

- une IDE version 1.8: servira à uploader les fichiers statiques.
- une IDE avec la dernière version disponible: pour le reste.

⚠️  A  chaque fois que vous souhaiter uploader des fichiers statiques sur votre board, il est nécéssaire de fermer le deuxième afin de ne pas occuper le port série nécéssaire à l'upload des fichiers.

## 1. Réaliser le circuit Arduino au moyen du plan fournis

__Le plan du circuit__

[le plan réalisé sur Fritzing](plan.png)

__Les composants requis__

- La board ESP32 Feather
- Capteur de couleur: APDS9260

## 2. Construire l'interface

__Télécharger les fichiers sources__

```bash
git clone https://github.com/julessandoz/arduinoColorPalette
cd ArduinoColorPalette
```

__Modifier le fichier build.sh__

```bash
# Modifier le chemin vers le répertoire du projet arduino 
# selon le schéma suivant
dir="<chemin/vers/le/dossier/Arduino>/<nomDuSketch>/data"
# exemple
dir="/Users/user01/Documents/Arduino/monPremierSketch/data"
```

__Upload__

```bash
npm i
# construit le projet dans le répertoire dist
# et déplace le contenu de dist dans le répertoire du projet arduino
npm run upload
```

## 3. Installer les libraires arduino suivantes

Une fois le projet ouvert dans l'IDE Arduino, installer les libraires suivantes.

- AsyncTCP
- ESPAsyncWebSrv
- SPIFFS
- Arduino_APDS9960

## 4. Upload les fichiers statiques sur l'Arduino

L'upload des fichiers statiques à servir par le serveur web est réalisé au moyen de __Arduino IDE__

⚠️  si l'upload est réalisé au moyen de __Arduino IDE__ il faut s'assurer que la version de l'ide n'est pas supérieure à __1.8__

__Marche à suivre__

1. Ouvrir le projet dans l'IDE
2. S'assurer que le bon port série est sélectionné
3. Ajouter le board pour ESP32
 - [SPIFFS Error: esptool not found!](https://rntlab.com/question/spiffs-error-esptool-not-found/)
4. Upload des fichiers: Outils->ESP32 Sketch Data Upload

## 5. Connecter le serveur web au wifi

Ouvrir le sketch arduino avec l'IDE arduino et compléter les lignes suivantes tout en haut du fichier avec vos informations de connexion.

```c
const char* ssid = "Le nom de votre réseaux wifi ici";
const char* password = "Votre mot de passe ici";
```

Afin de pouvoir consulter le site web sur un navigateur, il est nécéssire d'être conecté au même résaux wifi que le serveur. l'addresse du site web est affichée dans le Serial moniteur de l'IDE Arduino sur `115200`.

## 6. Compilation et upload

Vous pouvez à présent compiler et uploader votre code sur votre ESP32 au moyen de l'IDE Arduino.

📚 A des fins de débogage vous pouvez consulter les logs du programme sur le `baude rate 115200`

# Informations complémentaire sur le projet

En raison de la luminosité ambiante, le capteur de couleur n'est pas très fiable

# Améliorations potentielles

## 1, Optimisation du capteur
Pour régler les problèmes de captation de la couleur dus à la lumière ambiante, le capteur pourrait être protégé de la lumière extérieure et éclairé par une LED attachée. Cela permettrait au capteur de toujours faire son travail dans des conditions optimales.

## 2. Affichage de la palette sur l'appareil
Nous aurions aimé ajouter un affichage de la palette de couleurs directement sur le capteur en plus de l'interface web. Ceci pourrait être réalisé à l'aide de LED RGB par exemple.

# Quelques sources d'inspiration
- [How to make Color Detector using TCS230 | TCS3200 Color Sensor, Arduino and LCD Display](https://www.youtube.com/watch?v=HsjrcjRNFwk)
- [Arduino Based Real Life RGB Colour Picker - Make Your Own](https://www.youtube.com/watch?v=JeYrPW01xNA)
