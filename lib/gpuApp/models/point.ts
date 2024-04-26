import { vec4 } from "webgpu-matrix";
import { AsUniform } from "./buffers/asUniform";
import { Model } from "../model";

export class Point implements Model {
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

  asUniform(device: GPUDevice) {
    this.translation = new AsUniform(this.toVector(), device);
  }

  writeToGpu() {
    this.translation.writeToGpu();
  }

  gpuBuffer() {
    return this.translation.gpuBuffer();
  }

  bindGroupEntries(index: number) {
    return this.translation.bindGroupEntries(index);
  }
}

export const point = (x: number, y: number, z: number = -1) => Point.create(x, y, z);
