export const premultiply = (color: GPUColorDict) => {
  const { a } = color;
  return {
    r: color.r * a,
    g: color.g * a,
    b: color.b * a,
    a,
  };
};

export const normalizeColor = (color: GPUColorDict, alphaMode: GPUCanvasAlphaMode) => {
  if (alphaMode === "opaque") return color;

  return premultiply(color);
}