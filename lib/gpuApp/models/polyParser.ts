import { toTriangles } from "./toTriangles";
import { Points } from "./point";

export class PolyParser {
  points: Points;
  indices: number[];
  length: number;
  matches!: number[];

  constructor(points: Points) {
    this.points = points;
    this.length = points.length;
    this.indices = [];
  }

  findNewPoints(points: Points) {
    this.setInitialIndices(points);

    return this.indices.reduce((collection, matchValue, index) => {
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
    this.indices = matches;
  }

  updateIndices(newIndices: number[]) {
    let currentIndexPosition = 0;
    this.indices = this.indices.map((matchValue) => {
      if (matchValue !== -1) return matchValue;

      const updatedIndex = newIndices[currentIndexPosition];
      currentIndexPosition += 1;
      return updatedIndex;
    }, []);
  }

  get triangleIndices() {
    return toTriangles(this.indices);
  }
}
