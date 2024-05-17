import { describe, it, expect, vi, beforeEach } from "vitest";
import { point } from "../../../lib/gpuApp/models/point";
import { Subgon } from "../../../lib/gpuApp/models/subgon";
import { Polygons } from "../../../lib/gpuApp/models/polygons";

describe("polygons", () => {
  describe("when the list is just one polygon", () => {
    it("has the right length", () => {
      const background = new Polygons();
      background.add([
        point(0.5, 0.5),
        point(0.75, 0.5),
        point(0.75, 0.25),
        point(0.5, 0.25, 0.5),
      ]);

      expect(background.length).toEqual(1);
    });

    it("can be accessed via the polygon method with an index", () => {
      const background = new Polygons();
      background.add([
        point(0.5, 0.5),
        point(0.75, 0.5),
        point(0.75, 0.25),
        point(0.5, 0.25, 0.5),
      ]);

      const poly = background.at(0);
      expect(poly).toBeInstanceOf(Subgon);
      expect(poly.length).toEqual(4);
    });

    it("stores the data correctly", () => {
      const background = new Polygons();
      background.add([
        point(0.5, 0.5),
        point(0.75, 0.5),
        point(0.75, 0.25),
        point(0.5, 0.25, 0.5),
      ]);

      expect(background.vertices[0]).toBeCloseTo(0.5);
      expect(background.vertices[1]).toBeCloseTo(0.5);
      expect(background.vertices[2]).toBeCloseTo(0.0);
      expect(background.vertices[3]).toBeCloseTo(1);

      expect(background.vertices[4]).toBeCloseTo(0.75);
      expect(background.vertices[5]).toBeCloseTo(0.5);
      expect(background.vertices[6]).toBeCloseTo(0.0);
      expect(background.vertices[7]).toBeCloseTo(1);

      expect(background.vertices[8]).toBeCloseTo(0.75);
      expect(background.vertices[9]).toBeCloseTo(0.25);
      expect(background.vertices[10]).toBeCloseTo(0.0);
      expect(background.vertices[11]).toBeCloseTo(1);

      expect(background.vertices[12]).toBeCloseTo(0.5);
      expect(background.vertices[13]).toBeCloseTo(0.25);
      expect(background.vertices[14]).toBeCloseTo(0.5);
      expect(background.vertices[15]).toBeCloseTo(1);
    });

    it.skip("stores indice for the renderable triangles correctly", () => {
      const background = new Polygons();
      background.add([
        point(0.5, 0.5),
        point(0.75, 0.5),
        point(0.75, 0.25),
        point(0.5, 0.25, 0.5),
      ]);

      expect(background.indices.length).toEqual(6);

      expect(background.indices[0]).toEqual(0);
      expect(background.indices[1]).toEqual(1);
      expect(background.indices[2]).toEqual(2);

      expect(background.indices[3]).toEqual(2);
      expect(background.indices[4]).toEqual(3);
      expect(background.indices[5]).toEqual(0);
    });
  });

  describe("when the list is multiple polygons of different lengths", () => {
    it("has the right length", () => {
      const poly = new Polygons();
      poly.add([
        point(0.5, 0.5),
        point(0.75, 0.5),
        point(0.75, 0.25),
        point(0.5, 0.25, 0.5),
      ]);
      poly.add([point(0.5, 0.25, 0.5), point(0.75, 0.25), point(0.75, 0)]);
      poly.add([
        point(0.75, 0),
        point(0.75, 0.25),
        point(0.75, 0.5),
        point(0.75, 0.75),
        point(1.0, 0.5),
      ]);

      expect(poly.length).toEqual(3);
    });

    it("each polygon can be accessed", () => {
      const poly = new Polygons();
      poly.add([
        point(0.5, 0.5),
        point(0.75, 0.5),
        point(0.75, 0.25),
        point(0.5, 0.25, 0.5),
      ]);
      poly.add([point(0.5, 0.25, 0.5), point(0.75, 0.25), point(0.75, 0)]);
      poly.add([
        point(0.75, 0),
        point(0.75, 0.25),
        point(0.75, 0.5),
        point(0.75, 0.75),
        point(1.0, 0.5),
      ]);

      expect(poly.at(0).length).toEqual(4);
      expect(poly.at(1).length).toEqual(3);
      expect(poly.at(2).length).toEqual(5);
    });

    it("stores the underlying vertex data without duplicates", () => {
      const poly = new Polygons();
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

    // I'd like the polygons to be able to transform themselves: translate, rotate, scale.
    // Does each poly hold on to the point indexes?

    // it("stores the index data correctly");
  });
});
