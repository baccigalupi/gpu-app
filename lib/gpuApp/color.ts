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
};

const splitHex3 = (hex: string) => {
  return [`${hex[0]}${hex[0]}`, `${hex[1]}${hex[1]}`, `${hex[2]}${hex[2]}`];
};

const splitHex6 = (hex: string) => {
  return [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)];
};

const stripPound = (hex: string) => {
  if (hex[0] !== "#") return hex;

  return hex.slice(1);
};

const map = {
  IndianRed: "CD5C5C",
  LightCoral: "F08080",
  Salmon: "FA8072",
  DarkSalmon: "E9967A",
  LightSalmon: "FFA07A",
  Crimson: "DC143C",
  Red: "FF0000",
  FireBrick: "B22222",
  DarkRed: "8B0000",
  Pink: "FFC0CB",
  LightPink: "FFB6C1",
  HotPink: "FF69B4",
  DeepPink: "FF1493",
  MediumVioletRed: "C71585",
  PaleVioletRed: "DB7093",
  Coral: "FF7F50",
  Tomato: "FF6347",
  OrangeRed: "FF4500",
  DarkOrange: "FF8C00",
  Orange: "FFA500",
  Gold: "FFD700",
  Yellow: "FFFF00",
  LightYellow: "FFFFE0",
  LemonChiffon: "FFFACD",
  LightGoldenrodYellow: "FAFAD2",
  PapayaWhip: "FFEFD5",
  Moccasin: "FFE4B5",
  PeachPuff: "FFDAB9",
  PaleGoldenrod: "EEE8AA",
  Khaki: "F0E68C",
  DarkKhaki: "BDB76B",
  Lavender: "E6E6FA",
  Thistle: "D8BFD8",
  Plum: "DDA0DD",
  Violet: "EE82EE",
  Orchid: "DA70D6",
  Fuchsia: "FF00FF",
  Magenta: "FF00FF",
  MediumOrchid: "BA55D3",
  MediumPurple: "9370DB",
  Amethyst: "9966CC",
  BlueViolet: "8A2BE2",
  DarkViolet: "9400D3",
  DarkOrchid: "9932CC",
  DarkMagenta: "8B008B",
  Purple: "800080",
  Indigo: "4B0082",
  SlateBlue: "6A5ACD",
  DarkSlateBlue: "483D8B",
  GreenYellow: "ADFF2F",
  Chartreuse: "7FFF00",
  LawnGreen: "7CFC00",
  Lime: "00FF00",
  LimeGreen: "32CD32",
  PaleGreen: "98FB98",
  LightGreen: "90EE90",
  MediumSpringGreen: "00FA9A",
  SpringGreen: "00FF7F",
  MediumSeaGreen: "3CB371",
  SeaGreen: "2E8B57",
  ForestGreen: "228B22",
  Green: "008000",
  DarkGreen: "006400",
  YellowGreen: "9ACD32",
  OliveDrab: "6B8E23",
  Olive: "808000",
  DarkOliveGreen: "556B2F",
  MediumAquamarine: "66CDAA",
  DarkSeaGreen: "8FBC8F",
  LightSeaGreen: "20B2AA",
  DarkCyan: "008B8B",
  Teal: "008080",
  Aqua: "00FFFF",
  Cyan: "00FFFF",
  LightCyan: "E0FFFF",
  PaleTurquoise: "AFEEEE",
  Aquamarine: "7FFFD4",
  Turquoise: "40E0D0",
  MediumTurquoise: "48D1CC",
  DarkTurquoise: "00CED1",
  CadetBlue: "5F9EA0",
  SteelBlue: "4682B4",
  LightSteelBlue: "B0C4DE",
  PowderBlue: "B0E0E6",
  LightBlue: "ADD8E6",
  SkyBlue: "87CEEB",
  LightSkyBlue: "87CEFA",
  DeepSkyBlue: "00BFFF",
  DodgerBlue: "1E90FF",
  CornflowerBlue: "6495ED",
  MediumSlateBlue: "7B68EE",
  RoyalBlue: "4169E1",
  Blue: "0000FF",
  MediumBlue: "0000CD",
  DarkBlue: "00008B",
  Navy: "000080",
  MidnightBlue: "191970",
  Cornsilk: "FFF8DC",
  BlanchedAlmond: "FFEBCD",
  Bisque: "FFE4C4",
  NavajoWhite: "FFDEAD",
  Wheat: "F5DEB3",
  BurlyWood: "DEB887",
  Tan: "D2B48C",
  RosyBrown: "BC8F8F",
  SandyBrown: "F4A460",
  Goldenrod: "DAA520",
  DarkGoldenrod: "B8860B",
  Peru: "CD853F",
  Chocolate: "D2691E",
  SaddleBrown: "8B4513",
  Sienna: "A0522D",
  Brown: "A52A2A",
  Maroon: "800000",
  White: "FFFFFF",
  Snow: "FFFAFA",
  Honeydew: "F0FFF0",
  MintCream: "F5FFFA",
  Azure: "F0FFFF",
  AliceBlue: "F0F8FF",
  GhostWhite: "F8F8FF",
  WhiteSmoke: "F5F5F5",
  Seashell: "FFF5EE",
  Beige: "F5F5DC",
  OldLace: "FDF5E6",
  FloralWhite: "FFFAF0",
  Ivory: "FFFFF0",
  AntiqueWhite: "FAEBD7",
  Linen: "FAF0E6",
  LavenderBlush: "FFF0F5",
  MistyRose: "FFE4E1",
  Gainsboro: "DCDCDC",
  LightGrey: "D3D3D3",
  Silver: "C0C0C0",
  DarkGray: "A9A9A9",
  Gray: "808080",
  DimGray: "696969",
  LightSlateGray: "778899",
  SlateGray: "708090",
  DarkSlateGray: "2F4F4F",
  Black: "000000",
} as Record<string, string>;

export const getNamedColor = (name: string) => {
  return map[name] || map["Black"];
};
