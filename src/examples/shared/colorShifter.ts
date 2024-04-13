const defaultBackgroundColor = {
  r: 0.1172,
  g: 0.1602,
  b: 0.2304,
  a: 1.0,
};

export type ColorRates = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export const colorDictToArray = (colorDict: GPUColorDict, opacityOverride: number | null = null): number[] => {
  const a = opacityOverride || colorDict.a;
  return [colorDict.r, colorDict.g, colorDict.b, a];
}

const rateReducer = 500;

export class ColorShifter {
  color: GPUColorDict;
  nextColor: GPUColorDict;

  rates: ColorRates;

  constructor(initialColor: GPUColorDict = defaultBackgroundColor) {
    this.color = initialColor;
    this.nextColor = initialColor;
    this.rates = {
      r: Math.random() / rateReducer,
      g: Math.random() / rateReducer,
      b: Math.random() / rateReducer,
      a: Math.random() / rateReducer,
    };
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
    const a = this.calculate(this.color.a, this.rates.a);

    this.nextColor = {
      r,
      g,
      b,
      a,
    };
  }

  nextOutOfBounds() {
    return (
      this.valueOutOfBound(this.nextColor.r) ||
      this.valueOutOfBound(this.nextColor.g) ||
      this.valueOutOfBound(this.nextColor.b) ||
      this.valueOutOfBound(this.nextColor.a)
    );
  }

  toggleRates() {
    if (this.valueOutOfBound(this.nextColor.r)) this.rates.r *= -1;
    if (this.valueOutOfBound(this.nextColor.g)) this.rates.g *= -1;
    if (this.valueOutOfBound(this.nextColor.b)) this.rates.b *= -1;
    if (this.valueOutOfBound(this.nextColor.a)) this.rates.a *= -1;
  }

  calculate(value: number, rate: number) {
    return value - rate;
  }

  valueOutOfBound(value: number) {
    return value > 1 || value < 0;
  }
}
