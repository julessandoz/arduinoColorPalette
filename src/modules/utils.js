import * as convert from "color-convert";

import { Notyf } from "notyf";
import "notyf/notyf.min.css";
const notyf = new Notyf();

export const generatePalette = (hex) => {
  // crée un tableau vide.
  const colors = [];

  // converti le hex d'entrée en tableau hsl. Ne récupérer que les
  // deux premières valeurs.
  const [h, s] = convert.hex.hsl(hex);

  // Itère entre 0 et 100 par intervalle de 10
  for (let i = 0; i <= 100; i += 10) {
    // À chaque itération, pousse un nouveau tableau dans colors contenant
    // la teinte (fixe), la saturation (fixe) et la luminosité déterminée par
    // l'index de la boucle.
    colors.push([h, s, i]);
  }

  // Retourne le tableau.
  return colors;
};

export const hexToCSSHSL = (hex) => {
  // tranforme le hex d'entrée en HSL.
  const hsl = convert.hex.hsl(hex);
  // Retourne une chaîne de caractère au format css.
  return `${hsl[0]}deg ${hsl[1]}% ${hsl[2]}%`;
};

export const isHexColor = (hex) => /^#[0-9A-F]{6}$/i.test(hex);
