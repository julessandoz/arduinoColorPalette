import { Notyf } from "notyf";
import "notyf/notyf.min.css";

import { Color } from "./modules/Color";
import {
  isHexColor,
  hexToCSSHSL,
  // generatePalette
} from "./modules/utils";
import generatePalette from './modules/palette';
import WebSocketClient from "websocket/lib/WebSocketClient";

// Instancier Notyf
const notyf = new Notyf();
document.querySelectorAll('.wrapper__mode label').forEach(i => {
  i.addEventListener('input', () => {
    const value = document.querySelector("form input").value;
    updatePalette(value);
  })
})

const socket = new WebSocketClient();
socket.on('open', () => {
  socket.send('hello');
})

// Cherche l'élément <form> dans le DOM
const formElement = document.querySelector("form");

// Cherche l'élément <main> des couleurs dans le DOM
const colorContainer = document.querySelector("main");

const handleForm = (e) => {
  try {
    // Empêche le refresh lors de la soumission du formulaire
    e.preventDefault();
    // Cherche la valeur de l'élément <input>
    const inputValue = e.target.firstElementChild.value;
    updatePalette(inputValue);
    // Vérifie que la valeur soit bien un code hexadécimal
  } catch (err) {
    // Attrape les erreurs du block try et les affiche dans une notification.
    notyf.error(err.message);
  }
};

const handleClick = async (e) => {
  // Cherche l'élément avec la classe "color" le plus proche de la cible du
  // click et récupère son data-color.
  const color = e.target.closest(".color").dataset.color;

  // Copie de façon asynchrone la couleur dans le presse-papier
  await navigator.clipboard.writeText(color);

  // Affiche un message de succès dans une notification
  notyf.success(`copied ${color} to clipboard`);
};

const displayColors = (palette) => {
  // Efface tout le contenu de l'élément <main>
  colorContainer.innerHTML = "";

  // Cherche l'élément header dans le DOM
  const header = document.querySelector("header");
  // Ajoute la classe "minimized" au header
  header.classList.add("minimized");

  // Redéfinis background-size.
  document.body.style.backgroundSize = `400% 400%`;

  palette.map((c) => new Color(c).display(colorContainer));
};

function updatePalette(inputValue) {

  if (!isHexColor(inputValue)) {
    // Si ce n'est pas le cas, balancer l'erreur
    throw new Error(`${inputValue} is not a valid Hexadecimal color`);
  }


  const paletteMode = document.querySelector("input[type='radio']:checked").value;

  const option = { scheme: paletteMode };
  const hsl = hexToCSSHSL(inputValue);
  const part = hsl.split(' ');
  const h = part[0].match(/\d*/)[0];
  const s = part[1];
  const l = part[2];

  let palette = generatePalette(h, s, l, option);
  palette = palette.map(p => {
    const part = p.split(',');
    const h = part[0].match(/\d+/)[0];
    const s = part[1].match(/\d+/)[0];
    const l = part[2].match(/\d+/)[0];
    return [h, `${s}`, `${l}`];
  })

  logPalette(palette, paletteMode);
  displayColors(palette);
}

formElement.addEventListener("submit", handleForm);
colorContainer.addEventListener("click", handleClick);

function logPalette(palette, mode) {
  let output = palette.map(c => {
    return [`background:hsl(${c[0]}deg,${c[1]}%,${c[2]}%);`]
  })
  const out = []
  output.forEach(o => { out.push(o[0]) })
  const c = "    ";
  console.log(`${mode} %c ${c} %c ${c} %c ${c} %c ${c} %c ${c} %c ${c}`, ...out);
}
