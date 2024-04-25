export const premultiply = (color: GPUColorDict) => {
  const { a } = color;
  return {
    r: color.r * a,
    g: color.g * a,
    b: color.b * a,
    a,
  };
};

export const normalizeColor = (
  color: GPUColorDict,
  alphaMode: GPUCanvasAlphaMode,
) => {
  if (alphaMode === "opaque") return color;

  return premultiply(color);
};

export const colorDictToArray = (
  colorDict: GPUColorDict,
  opacityOverride: number | null = null,
): number[] => {
  const a = opacityOverride || colorDict.a;
  return [colorDict.r, colorDict.g, colorDict.b, a];
};

export const hexToDecimal = (hex: string) => {
  const stripped = stripPound(hex);
  const split = splitHex(stripped);
  return split.map((number: string) => parseInt(number, 16) / 256);
};

export const hexTo256Ints = (hex: string) => {
  const split = splitHex(hex);
  return split.map((number: string) => parseInt(number, 16));
};

export const splitHex = (hex: string) => {
  const stripped = stripPound(hex);

  if (stripped.length === 3) return splitHex3(stripped);

  return splitHex6(stripped);
}

const splitHex3 = (hex: string) => {
  return [
    `${hex[0]}${hex[0]}`,
    `${hex[1]}${hex[1]}`,
    `${hex[2]}${hex[2]}`
  ];
};

const splitHex6 = (hex: string) => {
  return [
    hex.slice(0, 2),
    hex.slice(2, 4),
    hex.slice(4, 6),
  ];
};

const stripPound = (hex: string) => {
  if (hex[0] !== "#") return hex;

  return hex.slice(1);
};
