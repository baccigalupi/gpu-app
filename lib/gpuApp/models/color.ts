import { vec4, vec3 } from "webgpu-matrix";
import { Vec4 } from "./matrixTypes";
import { AsUniform } from "./buffers/asUniform";
import { Model } from "./modelType";

export class ColorModel implements Model {
  premultiplied: boolean;
  translation!: AsUniform;
  data: Vec4;

  constructor(data: Vec4) {
    this.data = data;
    this.premultiplied = false;
  }

  static fromDict(color: GPUColorDict) {
    const data = vec4.create(color.r, color.g, color.b, color.a);
    return new ColorModel(data);
  }

  get r() {
    return this.data[0];
  }
  get g() {
    return this.data[1];
  }
  get b() {
    return this.data[2];
  }
  get a() {
    return this.data[3];
  }
  get rgb() {
    return vec3.create(this.r, this.g, this.b);
  }

  set r(value: number) {
    this.data[0] = value;
  }

  set g(value: number) {
    this.data[1] = value;
  }

  set b(value: number) {
    this.data[2] = value;
  }

  set a(value: number) {
    this.data[3] = value;
  }

  set rgb([r, g, b]) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  asUniform(device: GPUDevice) {
    this.translation = new AsUniform(this.data, device);
  }

  writeToGpu() {
    this.translation.writeToGpu();
  }

  gpuBuffer() {
    return this.translation.gpuBuffer();
  }

  bindGroupEntry(index: number) {
    return this.translation.bindGroupEntry(index);
  }
}
