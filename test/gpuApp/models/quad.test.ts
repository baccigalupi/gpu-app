import { describe, it, expect, vi, beforeEach } from "vitest";
import { quad } from "../../../lib/gpuApp/models/quad";
import { point, dimension } from "../../../lib/gpuApp/models/point";

describe("quad", () => {
  it("vertex data is packed into a typed array correctly", () => {
    const polygon = quad(
      point(0.5, 0.5),
      point(0.75, 0.5),
      point(0.75, 0.25),
      point(0.5, 0.25, 0.5),
    );

    expect(polygon.vertexData[0]).toEqual(polygon.p1x);
    expect(polygon.vertexData[1]).toEqual(polygon.p1y);
    expect(polygon.vertexData[2]).toEqual(polygon.p1z);
    expect(polygon.vertexData[3]).toEqual(1);

    expect(polygon.vertexData[4]).toEqual(polygon.p2x);
    expect(polygon.vertexData[5]).toEqual(polygon.p2y);
    expect(polygon.vertexData[6]).toEqual(polygon.p2z);
    expect(polygon.vertexData[7]).toEqual(1);

    expect(polygon.vertexData[8]).toEqual(polygon.p3x);
    expect(polygon.vertexData[9]).toEqual(polygon.p3y);
    expect(polygon.vertexData[10]).toEqual(polygon.p3z);
    expect(polygon.vertexData[11]).toEqual(1);

    expect(polygon.vertexData[12]).toEqual(polygon.p4x);
    expect(polygon.vertexData[13]).toEqual(polygon.p4y);
    expect(polygon.vertexData[14]).toEqual(polygon.p4z);
    expect(polygon.vertexData[15]).toEqual(1);
  });

  describe("mutation and transformation", () => {
    it("allows manipulating individual aspects of points", () => {
      const polygon = quad(
        point(0.5, 0.5),
        point(0.75, 0.5),
        point(0.75, 0.25),
        point(0.5, 0.25, 0.5),
      );
      expect(polygon.p1z).toEqual(0);
      expect(polygon.p2z).toEqual(0);
      expect(polygon.p3z).toEqual(0);
      expect(polygon.p4z).toEqual(0.5);

      polygon.p1x = 0.55;
      polygon.p2y = 0.6;
      polygon.p3z = 0.5;
      polygon.p4x = 0.45;
      expect(polygon.p1x).toBeCloseTo(0.55);
      expect(polygon.p2y).toBeCloseTo(0.6);
      expect(polygon.p3z).toBeCloseTo(0.5);
      expect(polygon.p4x).toBeCloseTo(0.45);

      expect(polygon.vertexData[0]).toBeCloseTo(0.55);
      expect(polygon.vertexData[5]).toBeCloseTo(0.6);
      expect(polygon.vertexData[10]).toBeCloseTo(0.5);
      expect(polygon.vertexData[12]).toBeCloseTo(0.45);
    });

    it("can be moved in x, y and z", () => {
      const amount = dimension(1, 2, 0.5);

      const polygon = quad(
        point(0.5, 0.5),
        point(0.75, 0.5),
        point(0.75, 0.25),
        point(0.5, 0.25, 0.5),
      );

      polygon.translate(amount);

      expect(polygon.p1x).toBeCloseTo(1.5);
      expect(polygon.p2x).toBeCloseTo(1.75);
      expect(polygon.p3x).toBeCloseTo(1.75);
      expect(polygon.p4x).toBeCloseTo(1.5);

      expect(polygon.p1y).toBeCloseTo(2.5);
      expect(polygon.p2y).toBeCloseTo(2.5);
      expect(polygon.p3y).toBeCloseTo(2.25);
      expect(polygon.p4y).toBeCloseTo(2.25);

      expect(polygon.p1z).toBeCloseTo(0.5);
      expect(polygon.p2z).toBeCloseTo(0.5);
      expect(polygon.p3z).toBeCloseTo(0.5);
      expect(polygon.p4z).toBeCloseTo(1.0);
    });

    // it("can be scaled as a whole around it's center");
    // it("can be scaled around a point");
    // it("can be rotated as a whole");
    // it("can be rotated around a specific point");
    // it("can be translated");
  });
});
