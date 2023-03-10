import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import * as convert from "color-convert";
import { Color } from "./modules/Color";
import {
  isHexColor,
  hexToCSSHSL,
} from "./modules/utils";
import generatePalette from './modules/palette';

let calibration = 0;
const formElement = document.querySelector("form");
const colorContainer = document.querySelector("main");
const input = document.querySelector("input[type='text']");
const calibrateSamples = document.querySelectorAll('.calibrate__samples>div');
const calibrateBtn = document.querySelector('.calibrate');
let CONNEXION = false;
const webSocket = new WebSocket(`ws://${window.location.host}`);
const calibrateInputs = document.querySelectorAll('#r,#g,#b');

const notyf = new Notyf();
document.querySelectorAll('.wrapper__mode label').forEach(i => {
  i.addEventListener('input', () => {
    const value = document.querySelector("form input").value;
    updatePalette(value);
  })
})

formElement.addEventListener("submit", handleForm);

colorContainer.addEventListener("click", handleClick);

calibrateBtn.addEventListener('click', (e) => {
  e.preventDefault();
  calibrateSamples[0].classList.remove('is-display-none');
  calibration = 1;
})

webSocket.addEventListener('open', () => {
  const msg = 'WebSocket connexion ouverte'
  console.log(msg);
  CONNEXION = true;
  notyf.success(msg);
});

webSocket.addEventListener('message', hexColor => {
  document.querySelector("form input").value = hexColor.data;
  updatePalette(hexColor.data);
});

webSocket.addEventListener('close', () => {
  const msg = 'WebSocket connexion fermée'
  console.log(msg);
  CONNEXION = false;
  notyf.error(msg);
});

webSocket.addEventListener('error', event => {
  const msg = 'WebSocket erreur'
  console.log(msg, event);
  notyf.error(msg);
  CONNEXION = false;
});

function sendData(hexPalette) {
  if (CONNEXION) {
    let str = '';
    hexPalette.forEach((color, i) => {
      let separator = i != hexPalette.length - 1 ? '|' : '';
      const rgb = convert.hsl.rgb(color);
      str += `${rgb[0]},${rgb[1]},${rgb[2]}${separator}`
    })
    webSocket.send(str);
  }
}

function handleForm(e) {
  try {
    e.preventDefault();
    const inputValue = e.target.firstElementChild.value;
    updatePalette(inputValue);
  } catch (err) {
    notyf.error(err.message);
  }
}

async function handleClick(e) {
  const color = e.target.closest(".color").dataset.color;
  await navigator.clipboard.writeText(color);
  notyf.success(`${color} copié dans le press-papier`);
}

function displayColors(palette) {
  colorContainer.innerHTML = "";
  const header = document.querySelector("header");
  header.classList.add("minimized");
  document.body.style.backgroundSize = `400% 400%`;
  palette.map((c) => new Color(c).display(colorContainer));
}

function diff(value) {
  const diff = 255 - value;
  const percentage = (diff * 100) / 255
  return percentage;
}

function checkForCalibration(rgb) {
  console.log(rgb)
  if (calibration == 1) {
    const r = rgb[0]
    const percentageDiff = diff(r);
    localStorage.setItem('r', percentageDiff);
    calibration++;
    calibrateInputs[0].checked = true;
    setTimeout(() => {
      calibrateSamples[0].classList.add('is-display-none');
      calibrateSamples[1].classList.remove('is-display-none');
      calibrateInputs[0].checked = false;
    }, 1000);
  }
  else if (calibration == 2) {
    const g = rgb[1]
    const diff = 255 - g;
    localStorage.setItem('g', diff);
    calibration++;
    calibrateInputs[1].checked = true;
    setTimeout(() => {
      calibrateSamples[1].classList.add('is-display-none');
      calibrateSamples[2].classList.remove('is-display-none');
      calibrateInputs[1].checked = false;
    }, 1000);
  }
  else if (calibration == 3) {
    const b = rgb[2]
    const diff = 255 - b;
    localStorage.setItem('b', diff);
    calibration++;
    calibrateInputs[2].checked = true;
    setTimeout(() => {
      calibrateInputs[2].checked = false;
      calibrateSamples[2].classList.add('is-display-none');
    }, 1000);
  }
  return calibration
}

function updatePalette(inputValue) {

  const rgb = convert.hex.rgb(inputValue);
  if (!isHexColor(inputValue)) {
    return notyf.error(`${inputValue} n'est pas une valeur Hexadecimal`);
  }

  const status = checkForCalibration(rgb);
  if (status == 4) {
    calibration = 0;
    return;
  }
  if (status != 0) {
    return;
  }

  const paletteMode = document.querySelector("input[type='radio']:checked").value;

  const option = { scheme: paletteMode };
  const clamp = (num, min, max) => Math.min(Math.max(num, min), max)
  const r = clamp((Math.ceil(255 / 100 * localStorage.getItem('r') || 0)) + rgb[0], 0, 255)
  const g = clamp((Math.ceil(255 / 100 * localStorage.getItem('g') || 0)) + rgb[1], 0, 255)
  const b = clamp((Math.ceil(255 / 100 * localStorage.getItem('b') || 0)) + rgb[2], 0, 255)

  const newHex = convert.rgb.hex([r, g, b]);

  const hsl = hexToCSSHSL(newHex);
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

  input.style.background = `hsl(${hsl})`;
  logPalette(palette, paletteMode);
  displayColors(palette);
  sendData(palette);
}

function logPalette(palette, mode) {
  let output = palette.map(c => {
    return [`background:hsl(${c[0]}deg,${c[1]}%,${c[2]}%);`]
  })
  const out = []
  output.forEach(o => { out.push(o[0]) })
  const c = "    ";
  console.log(`${mode} %c ${c} %c ${c} %c ${c} %c ${c} %c ${c} %c ${c}`, ...out);
}
