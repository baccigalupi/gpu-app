import { Points } from "./point";
import { PolyParser } from "./polyParser";

export class PolygonStorage {
  points: Points;
  indices: number[];

  constructor() {
    this.points = [];
    this.indices = [];
  }

  add(points: Points) {
    const poly = new PolyParser(points);
    const newPoints = poly.findNewPoints(this.points);
    const newIndices = this.addNewPoints(newPoints);
    poly.updateIndices(newIndices);
    this.indices = this.indices.concat(poly.triangleIndices);
    return poly;
  }

  addNewPoints(newPoints: Points) {
    const startingIndex = this.points.length;
    return newPoints.map((point, index) => {
      this.points.push(point);
      return startingIndex + index;
    });
  }

  get vertices() {
    return this.points.reduce((collection, point) => {
      collection.push(point.x);
      collection.push(point.y);
      collection.push(point.z);
      collection.push(point.w);
      return collection;
    }, [] as number[]);
  }
}
