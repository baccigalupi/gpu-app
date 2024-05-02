import { Point, Points, POINT_LENGTH } from "./point";
import { Subgon } from "./subgon";

export class Polygons {
  subgons: Subgon[];
  length: number;
  private _vertices!: Float32Array;
  private _indices!: Int8Array;
  calculated: boolean;

  constructor() {
    this.subgons = [] as Subgon[];
    this.length = 0;
    this.calculated = false;
  }

  add(points: Points) {
    this.length += 1;
    this.subgons = this.subgons.concat(new Subgon(points));
    this.calculated = false;
  }

  polygonAt(index: number) {
    return this.subgons[index];
  }

  get vertices() {
    if (this.calculated) return this._vertices;
    this.recalculateStorage();
    return this._vertices;
  }

  get indices() {
    if (this.calculated) return this._indices;
    this.recalculateStorage();
    return this._indices;
  }

  recalculateStorage() {
    const storageLength = this.subgons.reduce(
      (sum, polygon) => sum + polygon.length * POINT_LENGTH,
      0,
    );
    this._vertices = new Float32Array(storageLength);

    let index = 0;

    this.subgons.forEach((polygon) => {
      polygon.points.forEach((point: Point) => {
        this._vertices[index] = point.x;
        this._vertices[index + 1] = point.y;
        this._vertices[index + 2] = point.z;
        this._vertices[index + 3] = point.w;
        index += 4;
      });
      polygon.resetStorage(this._vertices, index);
    });

    this.calculated = true;
  }
}
