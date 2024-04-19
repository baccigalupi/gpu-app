import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  normalizeColor,
  colorDictToArray,
  premultiply,
} from "../../lib/gpuApp/color";

describe("Color", () => {
  it("premulitply color makes the right weird calculation", () => {
    const color = { r: 0.5, g: 0.5, b: 0.5, a: 0.5 };
    const premulitpiedColor = premultiply(color);
    expect(premulitpiedColor).toEqual({
      r: 0.25,
      g: 0.25,
      b: 0.25,
      a: 0.5,
    });
  });

  it("normalization will leave as is when the alpha mode is opaque", () => {
    const color = { r: 0.5, g: 0.5, b: 0.5, a: 0.5 };
    const normalizedColor = normalizeColor(color, "opaque");
    expect(normalizedColor).toEqual(color);
  });

  it("normalization will premultiply when alpha mode is something else", () => {
    const color = { r: 0.5, g: 0.5, b: 0.5, a: 0.5 };
    const normalizedColor = normalizeColor(color, "premultiplied");
    expect(normalizedColor).toEqual({
      r: 0.25,
      g: 0.25,
      b: 0.25,
      a: 0.5,
    });
  });

  it("converts a dictionary to an array", () => {
    const color = { r: 0.1, g: 0.2, b: 0.3, a: 0.4 };
    expect(colorDictToArray(color)).toEqual([0.1, 0.2, 0.3, 0.4]);
  });
});
