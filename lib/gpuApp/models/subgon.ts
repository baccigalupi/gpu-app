import { Points } from "./point";

export class Subgon {
  points: Points;
  index: number;
  storage!: Float32Array;
  length: number;

  constructor(points: Points) {
    this.points = points;
    this.length = points.length;
    this.index = 0;
  }

  resetStorage(storage: Float32Array, index: number) {
    this.storage = storage;
    this.index = index;
  }
}
