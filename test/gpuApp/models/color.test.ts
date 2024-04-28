import { describe, it, expect, vi, beforeEach } from "vitest";

import { ColorModel } from "../../../lib/gpuApp/models/color";

describe("ColorModel", () => {
  describe("creator static methods", () => {
    it(".fromDict sets data to the right values", () => {
      const model = ColorModel.fromDict({ r: 0.25, g: 0.5, b: 0.75, a: 1.0 });

      expect(model.r).toEqual(0.25);
      expect(model.g).toEqual(0.5);
      expect(model.b).toEqual(0.75);
      expect(model.a).toEqual(1.0);
    });

    it(".fromHex sets the values correctly with a leading hash character", () => {
      const model = ColorModel.fromHex("#4d7a1f");

      expect(model.r).toBeCloseTo(0.3008);
      expect(model.g).toBeCloseTo(0.4766);
      expect(model.b).toBeCloseTo(0.1212);
    });

    it(".fromHex assumes full alpha", () => {
      const model = ColorModel.fromHex("#4d7a1f");

      expect(model.a).toBeCloseTo(1.0);
    });

    it(".fromHex can receive an optional alpha argument", () => {
      const model = ColorModel.fromHex("#4d7a1f", { alpha: 0.5 });

      expect(model.a).toBeCloseTo(0.5);
    });

    it(".fromDecimals", () => {
      const model = ColorModel.fromDecimals(0.23, 0.57, 0.44, 0.95);

      expect(model.r).toBeCloseTo(0.23);
      expect(model.g).toBeCloseTo(0.57);
      expect(model.b).toBeCloseTo(0.44);
      expect(model.a).toBeCloseTo(0.95);
    });
  });

  it("the data is stored as a vec4", () => {
    const color = ColorModel.fromDecimals(0.4, 0.5, 0.6, 0.7);

    expect(color.data).toBeInstanceOf(Float32Array);
    expect(color.data.length).toEqual(4);
  });
});
