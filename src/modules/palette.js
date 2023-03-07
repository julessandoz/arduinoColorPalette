function oppositeHue(h) {
  return (h + 180) % 360
}

// scheme generators
// -------------------------------------------

function generateAnalogousScheme(h, s, l, hueIncrement) {
  const lightnessWithPercent = l;
  const lightness = Number(lightnessWithPercent.replace('%', ''));

  return [
    [h, s, l],
    [h - hueIncrement/2, s, `${lightness + 1}%`],
    [h - hueIncrement, s, `${lightness - 1}%`],
    [h + hueIncrement/3, s, `${lightness + 2}%`],
    [h + hueIncrement/2, s, `${lightness - 2}%`],
    [h + hueIncrement, s, `${lightness - 2.5}%`],
  ]
}

function generateComplementaryScheme(h, s, l, hueIncrement) {
  const lightnessWithPercent = l;
  const lightness = Number(lightnessWithPercent.replace('%', ''));

  return [
    [h, s, l],
    [oppositeHue(h), s, `${lightness + 1}%`],
    [oppositeHue(h) - hueIncrement/2, s, `${lightness - 1}%`],
    [oppositeHue(h) - hueIncrement, s, `${lightness + 2}%`],
    [oppositeHue(h) + hueIncrement/2, s, `${lightness - 2}%`],
    [oppositeHue(h) + hueIncrement, s, `${lightness - 2.5}%`],
  ]
}

function generateTriadicScheme(h, s, l, hueIncrement) {
  const lightnessWithPercent = l;
  const lightness = Number(lightnessWithPercent.replace('%', ''));

  return [
    [h, s, l],
    [oppositeHue(h+hueIncrement), s, `${lightness + 1}%`],
    [oppositeHue(h) - hueIncrement/2, s, `${lightness - 1}%`],
    [oppositeHue(h) - hueIncrement, s, `${lightness + 2}%`],
    [oppositeHue(h) + hueIncrement/2, s, `${lightness - 2}%`],
    [oppositeHue(h) + hueIncrement, s, `${lightness -2.5}%`],
  ]
}


// palette generator
// -------------------------------------------

export default function generatePalette(h, s, l, { hueIncrement = 40,
  scheme = 'complementary' } = {}) {

  let colorValues = []
  switch (scheme) {
    case 'complementary':
      colorValues = generateComplementaryScheme(h, s, l, hueIncrement)
      break
    case 'analogous':
      colorValues = generateAnalogousScheme(h, s, l, hueIncrement)
      break
    case 'triadic':
        colorValues = generateTriadicScheme(h, s, l, hueIncrement)
      break
    default:
      colorValues = generateComplementaryScheme(h, s, l, hueIncrement)
  }

  const colors = []
  colorValues.forEach((color, i) => {
    const [h, s, l] = color
    colors.push(`hsl(${h},${s},${l})`);
  })

  return colors
}

