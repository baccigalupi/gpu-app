import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  normalizeColor,
  colorDictToArray,
  premultiply,
  hexToDecimal,
  hexTo256Ints,
  splitHex,
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

  describe("hex decimal functions", () => {
    it("splits a hex into three hex numbers", () => {
      const hex = "#4d7a1f";
      expect(splitHex(hex)).toEqual(["4d", "7a", "1f"]);
    });

    it("splits correctly when only three hex digits", () => {
      const hex = "#4a1";
      expect(splitHex(hex)).toEqual(["44", "aa", "11"]);
    });

    it("splits correctly without the hash", () => {
      let hex = "4a1";
      expect(splitHex(hex)).toEqual(["44", "aa", "11"]);

      hex = "4d7a1f";
      expect(splitHex(hex)).toEqual(["4d", "7a", "1f"]);
    });

    it("converts to 256 ints correctly", () => {
      const hex = "#4d7a1f";
      const colorValues = hexTo256Ints(hex);

      expect(colorValues[0]).toEqual(77);
      expect(colorValues[1]).toEqual(122);
      expect(colorValues[2]).toEqual(31);
    });

    it("converts to decimals correctly", () => {
      const hex = "#4d7a1f";
      const colorValues = hexToDecimal(hex);

      expect(colorValues[0]).toBeCloseTo(0.3008);
      expect(colorValues[1]).toBeCloseTo(0.4766);
      expect(colorValues[2]).toBeCloseTo(0.1212);
    });
  });
});
