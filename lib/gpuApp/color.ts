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
