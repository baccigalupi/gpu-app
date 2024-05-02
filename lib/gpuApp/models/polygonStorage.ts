import { Points } from "./point";
import { toTriangles } from "./toTriangles";

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

export class PolyParser {
  points: Points;
  private _indices: number[];
  length: number;
  matches!: number[];

  constructor(points: Points) {
    this.points = points;
    this.length = points.length;
    this._indices = [];
  }

  findNewPoints(points: Points) {
    this.setInitialIndices(points);

    return this._indices.reduce((collection, matchValue, index) => {
      if (matchValue === -1) {
        collection.push(this.points[index]);
      }
      return collection;
    }, [] as Points);
  }

  setInitialIndices(points: Points) {
    const pointsLength = points.length;
    const matches = new Array(this.length) as number[];
    for (let matchIndex = 0; matchIndex < this.length; matchIndex++) {
      let match = -1;
      for (let pointIndex = 0; pointIndex < pointsLength; pointIndex++) {
        if (points[pointIndex].equals(this.points[matchIndex])) {
          match = pointIndex;
          break;
        }
      }
      matches[matchIndex] = match;
    }
    this._indices = matches;
  }

  updateIndices(newIndices: number[]) {
    let currentIndexPosition = 0;
    this._indices = this._indices.map((matchValue) => {
      if (matchValue !== -1) return matchValue;

      const updatedIndex = newIndices[currentIndexPosition];
      currentIndexPosition += 1;
      return updatedIndex;
    }, []);
  }

  get triangleIndices() {
    return toTriangles(this._indices);
  }
}
