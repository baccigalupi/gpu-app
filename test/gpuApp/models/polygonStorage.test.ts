import { describe, it, expect, vi, beforeEach } from "vitest";
import { point } from "../../../lib/gpuApp/models/point";
import { PolygonStorage } from "../../../lib/gpuApp/models/polygonStorage";

describe("polygon storage concerns", () => {
  describe("when there is only one polygon with unique points", () => {
    it("has the vertices available as a list", () => {
      const storage = new PolygonStorage();
      storage.add([
        point(0.5, 0.5),
        point(0.75, 0.5),
        point(0.75, 0.25),
        point(0.5, 0.25, 0.5),
      ]);

      expect(storage.vertices[0]).toBeCloseTo(0.5);
      expect(storage.vertices[1]).toBeCloseTo(0.5);
      expect(storage.vertices[2]).toBeCloseTo(0.0);
      expect(storage.vertices[3]).toBeCloseTo(1);

      expect(storage.vertices[4]).toBeCloseTo(0.75);
      expect(storage.vertices[5]).toBeCloseTo(0.5);
      expect(storage.vertices[6]).toBeCloseTo(0.0);
      expect(storage.vertices[7]).toBeCloseTo(1);

      expect(storage.vertices[8]).toBeCloseTo(0.75);
      expect(storage.vertices[9]).toBeCloseTo(0.25);
      expect(storage.vertices[10]).toBeCloseTo(0.0);
      expect(storage.vertices[11]).toBeCloseTo(1);

      expect(storage.vertices[12]).toBeCloseTo(0.5);
      expect(storage.vertices[13]).toBeCloseTo(0.25);
      expect(storage.vertices[14]).toBeCloseTo(0.5);
      expect(storage.vertices[15]).toBeCloseTo(1);
    });

    it("stores indices as a collection ", () => {
      const storage = new PolygonStorage();
      storage.add([
        point(0.5, 0.5),
        point(0.75, 0.5),
        point(0.75, 0.25),
        point(0.5, 0.25, 0.5),
      ]);

      expect(storage.indices.length).toEqual(6);

      expect(storage.indices[0]).toEqual(0);
      expect(storage.indices[1]).toEqual(1);
      expect(storage.indices[2]).toEqual(2);

      expect(storage.indices[3]).toEqual(2);
      expect(storage.indices[4]).toEqual(3);
      expect(storage.indices[5]).toEqual(0);
    });
  });

  describe("when the list is multiple polygons of different lengths", () => {
    it("stores the underlying vertex data without duplicates", () => {
      const poly = new PolygonStorage();
      poly.add([
        point(0.5, 0.5), // 0
        point(0.75, 0.5), // 1
        point(0.75, 0.25), // 2
        point(0.5, 0.25, 0.5), // 3
      ]);
      poly.add([
        point(0.5, 0.25, 0.5), // dup 3
        point(0.75, 0.25), // dup 2
        point(0.75, 0), // 4
      ]);
      poly.add([
        point(0.75, 0), // dup 4
        point(0.75, 0.25), // dup 2
        point(0.75, 0.5), // dup 1
        point(0.75, 0.75), // 5
        point(1.0, 0.5), // 6
      ]);

      const vertices = poly.vertices;

      expect(vertices.length).toEqual(28);

      expect(vertices[12]).toEqual(0.5);
      expect(vertices[16]).toEqual(0.75);
      expect(vertices[21]).toEqual(0.75);
      expect(vertices[24]).toEqual(1);
      expect(vertices[25]).toEqual(0.5);
    });

    it("calculates the triangle indices correctly", () => {
      const poly = new PolygonStorage();
      poly.add([
        point(0.5, 0.5), // 0
        point(0.75, 0.5), // 1
        point(0.75, 0.25), // 2
        point(0.5, 0.25, 0.5), // 3
      ]);
      poly.add([
        point(0.5, 0.25, 0.5), // dup 3
        point(0.75, 0.25), // dup 2
        point(0.75, 0), // 4
      ]);
      poly.add([
        point(0.75, 0), // dup 4
        point(0.75, 0.25), // dup 2
        point(0.75, 0.5), // dup 1
        point(0.75, 0.75), // 5
        point(1.0, 0.5), // 6
      ]);

      const indices = poly.indices;

      expect(indices.length).toEqual(18);

      // first polygon, with two triangles
      expect(indices[0]).toEqual(0);
      expect(indices[1]).toEqual(1);
      expect(indices[2]).toEqual(2);
      expect(indices[3]).toEqual(2);
      expect(indices[4]).toEqual(3);
      expect(indices[5]).toEqual(0);

      // second polygon, just one triangle
      expect(indices[6]).toEqual(3);
      expect(indices[7]).toEqual(2);
      expect(indices[8]).toEqual(4);

      // last polygon, three triangles, five points
      expect(indices[9]).toEqual(4);
      expect(indices[10]).toEqual(2);
      expect(indices[11]).toEqual(1);
      expect(indices[12]).toEqual(1);
      expect(indices[13]).toEqual(5);
      expect(indices[14]).toEqual(4);
      expect(indices[15]).toEqual(5);
      expect(indices[16]).toEqual(6);
      expect(indices[17]).toEqual(4);
    });
  });
});
