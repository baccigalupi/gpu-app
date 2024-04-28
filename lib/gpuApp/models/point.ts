import { vec4 } from "webgpu-matrix";
import { AsUniform } from "./buffers/asUniform";

export class Point {
  translation!: AsUniform;
  data: number[];

  constructor(data: number[]) {
    this.data = data;
  }

  static create(x: number, y: number, z: number) {
    return new Point([x, y, z]);
  }

  get x() {
    return this.data[0];
  }
  get y() {
    return this.data[1];
  }
  get z() {
    return this.data[2];
  }

  set x(value: number) {
    this.data[0] = value;
  }

  set y(value: number) {
    this.data[1] = value;
  }

  set z(value: number) {
    this.data[2] = value;
  }

  toVector() {
    return vec4.create(this.x, this.y, this.z, 1);
  }
}

export const point = (x: number, y: number, z: number = 0) =>
  Point.create(x, y, z);

export const dimension = point;
export type Dimension = Point;
