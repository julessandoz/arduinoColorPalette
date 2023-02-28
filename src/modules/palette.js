function oppositeHue(h) {
  return (h + 180) % 360
}

// scheme generators
// -------------------------------------------

function generateAnalogousScheme(h, s, l, hueIncrement) {
  return [
    [h, s, l],
    [h - hueIncrement/2, s, l],
    [h - hueIncrement, s, l],
    [h + hueIncrement/3, s, l],
    [h + hueIncrement/2, s, l],
    [h + hueIncrement, s, l],
  ]
}

function generateComplementaryScheme(h, s, l, hueIncrement) {
  console.log("complementary")
  return [
    [h, s, l],
    [oppositeHue(h), s, l],
    [oppositeHue(h) - hueIncrement/2, s, l],
    [oppositeHue(h) - hueIncrement, s, l],
    [oppositeHue(h) + hueIncrement/2, s, l],
    [oppositeHue(h) + hueIncrement, s, l],
  ]
}

function generateTriadicScheme(h, s, l, hueIncrement) {
  console.log("triadic")
  return [
    [h, s, l],
    [oppositeHue(h+hueIncrement), s, l],
    [oppositeHue(h) - hueIncrement/2, s, l],
    [oppositeHue(h) - hueIncrement, s, l],
    [oppositeHue(h) + hueIncrement/2, s, l],
    [oppositeHue(h) + hueIncrement, s, l],
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

const colors = generatePalette(100, "74%", "58%", { scheme: 'dual', hueIncrement: 30 });
console.log(colors);
