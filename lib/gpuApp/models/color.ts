import { vec4 } from "webgpu-matrix";
import type { Vec4 } from "./matrixTypes";
import type { Model } from "../model";
import type { Buffer, BufferClass } from "./buffer";
import { hexToDecimal, getNamedColor } from "../color";
import { Uniform } from "./buffers/uniform";

export class ColorModel implements Model {
  data: Vec4;
  private bufferClass!: BufferClass;
  private _buffers!: Buffer[];

  constructor(data: number[]) {
    this.data = vec4.create(...data);
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

  static named(name: string, { alpha } = { alpha: 1.0 }) {
    const hex = getNamedColor(name);
    return ColorModel.fromHex(hex, { alpha });
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

  asUniform() {
    this.bufferClass = Uniform;
  }

  buffers(device: GPUDevice) {
    if (this._buffers) return this._buffers;

    this._buffers = [new this.bufferClass(this.data, device)];

    return this._buffers;
  }
}
