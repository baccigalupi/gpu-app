import { GpuApp } from "../gpuApp";
import { setupRenderPipeline } from "../gpuApp/renderPipeline";
import shaders from "../shaders/helloHardCoded.wgsl?raw";

const backgroundColor = {
  r: 0.1172,
  g: 0.1602,
  b: 0.2304,
  a: 1.0,
};

type ColorRates = {
  r: number;
  g: number;
  b: number;
}

const rateReducer = 100;

class ColorShifter {
  color: GPUColorDict;
  nextColor: GPUColorDict;

  rates: ColorRates;

  constructor(initialColor: GPUColorDict = backgroundColor) {
    this.color = initialColor;
    this.nextColor = initialColor;
    this.rates = {
      r: Math.random() / rateReducer,
      g: Math.random() / rateReducer,
      b: Math.random() / rateReducer
    }
  }

  update() {
    this.calculateNextColor();

    if (this.nextOutOfBounds()) {
      this.toggleRates();
      this.calculateNextColor();
    }
    
    this.color = this.nextColor;
    
    return this.color;
  }

  calculateNextColor() {
    const r = this.calculate(this.color.r, this.rates.r);
    const g = this.calculate(this.color.g, this.rates.g);
    const b = this.calculate(this.color.b, this.rates.b);

    this.nextColor = {
      ...this.color,
      r,
      g,
      b,
    }
  }

  nextOutOfBounds() {
    return (
      this.valueOutOfBound(this.nextColor.r) ||
      this.valueOutOfBound(this.nextColor.g) ||
      this.valueOutOfBound(this.nextColor.b)
    )
  }

  toggleRates() {
    if (this.valueOutOfBound(this.nextColor.r)) this.rates.r *= -1;
    if (this.valueOutOfBound(this.nextColor.g)) this.rates.g *= -1;
    if (this.valueOutOfBound(this.nextColor.b)) this.rates.b *= -1;
  }

  calculate(value: number, rate: number) {
    return value - rate;
  }

  valueOutOfBound(value: number) {
    return value > 1 || value < 0
  }
}

export const helloHardCoded = (gpuApp: GpuApp) => {
  const colorShifter = new ColorShifter();

  const pipeline = setupRenderPipeline({
    gpuApp,
    shaders,
    backgroundColor: colorShifter.color,
  });

  pipeline.renderLoop(() => {
    pipeline.backgroundColor = colorShifter.update();
  });
};
