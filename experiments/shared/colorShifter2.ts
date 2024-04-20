/// <reference types="@webgpu/types" />

import { vec3 } from "webgpu-matrix";
import { Vec3 } from "webgpu-matrix/dist/1.x/vec3";
import { ColorModel } from "../../lib/gpuApp/models/color";

export const defaultBackgroundColor = {
  r: 0.1172,
  g: 0.1602,
  b: 0.2304,
  a: 0.95,
};

const rateReducer = 500;

export class ColorShifter {
  color: ColorModel;
  nextColor: ColorModel;
  rates: Vec3;

  constructor(color: ColorModel) {
    this.color = color;
    this.nextColor = this.color;
    this.rates = vec3.create(
      Math.random() / rateReducer,
      Math.random() / rateReducer,
      Math.random() / rateReducer,
    );
  }

  update(alpha: number = 1) {
    this.calculateNextColor();

    if (this.nextOutOfBounds()) {
      this.toggleRates();
      this.calculateNextColor();
    }

    this.color.rgb = this.nextColor.rgb;
    this.color.a = alpha;

    return this.color;
  }

  calculateNextColor() {
    // cross product?
    const r = this.calculate(this.color.r, this.rates[0]);
    const g = this.calculate(this.color.g, this.rates[1]);
    const b = this.calculate(this.color.b, this.rates[2]);

    this.nextColor.rgb = [r, g, b];
    this.nextColor.a = this.color.a;
  }

  nextOutOfBounds() {
    return (
      this.valueOutOfBound(this.nextColor.r) ||
      this.valueOutOfBound(this.nextColor.g) ||
      this.valueOutOfBound(this.nextColor.b)
    );
  }

  toggleRates() {
    if (this.valueOutOfBound(this.nextColor.r)) this.rates[0] *= -1;
    if (this.valueOutOfBound(this.nextColor.g)) this.rates[1] *= -1;
    if (this.valueOutOfBound(this.nextColor.b)) this.rates[2] *= -1;
  }

  calculate(value: number, rate: number) {
    return value - rate;
  }

  valueOutOfBound(value: number) {
    return value > 1 || value < 0;
  }
}
