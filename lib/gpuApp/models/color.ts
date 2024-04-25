import { vec4 } from "webgpu-matrix";
import { AsUniform } from "./buffers/asUniform";
import { Model } from "./modelType";
import { hexToDecimal } from "../color";

export class ColorModel implements Model {
  translation!: AsUniform;
  data: number[];

  constructor(data: number[]) {
    this.data = data;
  }

  static fromDict(color: GPUColorDict) {
    return new ColorModel([color.r, color.g, color.b, color.a]);
  }

  static fromHex(hex: string, { alpha } = { alpha: 1.0 }) {
    const data = [...hexToDecimal(hex), alpha];
    return new ColorModel(data);
  }

  static fromDecimals(r: number, g: number, b: number, a = 1.0) {
    return new ColorModel([r, g, b, a]);
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
    return [this.r, this.g, this.b];
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

  toVector() {
    return vec4.create(this.r, this.g, this.b, this.a);
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

  bindGroupEntry(index: number) {
    return this.translation.bindGroupEntry(index);
  }
}
