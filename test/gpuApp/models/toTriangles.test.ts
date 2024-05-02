import { describe, it, expect, vi, beforeEach } from "vitest";
import { toTriangles } from "../../../lib/gpuApp/models/toTriangles";

describe("toTriangle", () => {
  it("returns the input indices when already a triangle", () => {
    const inputIndices = [0, 2, 4];
    expect(toTriangles(inputIndices)).toEqual(inputIndices);
  });

  it("returns two triangles when presented with a quad", () => {
    const inputIndices = [0, 2, 4, 5];
    const triangleIndices = toTriangles(inputIndices);
    expect(triangleIndices).toEqual([0, 2, 4, 4, 5, 0]);
  });

  it("returns three triangles when five pointed", () => {
    const inputIndices = [0, 2, 4, 5, 7];
    const triangleIndices = toTriangles(inputIndices);
    expect(triangleIndices).toEqual([0, 2, 4, 4, 5, 0, 5, 7, 0]);
  });

  it("returns many triangles when it is a mega-gon", () => {
    const inputIndices = [0, 2, 4, 5, 7, 9, 10, 12];
    const triangleIndices = toTriangles(inputIndices);
    expect(triangleIndices).toEqual([
      0, 2, 4, 4, 5, 0, 5, 7, 0, 7, 9, 0, 9, 10, 0, 10, 12, 0,
    ]);
  });
});
