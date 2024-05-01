import { Point, Points, POINT_LENGTH } from "./point";
import { Subgon } from "./subgon";

export class Polygons {
  userData: Subgon[];
  length: number;
  vertices: Float32Array;

  constructor() {
    this.userData = [] as Subgon[];
    this.length = 0;
    this.vertices = new Float32Array();
  }

  add(points: Points) {
    this.length += 1;
    this.userData = this.userData.concat(new Subgon(points));
    this.recalculateStorage();
  }

  polygonAt(index: number) {
    return this.userData[index];
  }

  recalculateStorage() {
    const storageLength = this.userData.reduce(
      (sum, polygon) => sum + polygon.length * POINT_LENGTH,
      0,
    );
    this.vertices = new Float32Array(storageLength);

    let index = 0;

    this.userData.forEach((polygon) => {
      polygon.points.forEach((point: Point) => {
        this.vertices[index] = point.x;
        this.vertices[index + 1] = point.y;
        this.vertices[index + 2] = point.z;
        this.vertices[index + 3] = point.w;
        index += 4;
      });
      polygon.resetStorage(this.vertices, index);
    });
  }
}
