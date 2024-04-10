export type OnFrameRateUpdate = (frameRate: number) => void;
const nullUpdater = (_rate: number) => {};

export class FrameRateCalculator {
  startTime: number;
  frameRate: number;
  onUpdate: OnFrameRateUpdate;

  constructor(onUpdate: OnFrameRateUpdate = nullUpdater) {
    this.startTime = performance.now();
    this.frameRate = 0;
    this.onUpdate = onUpdate;
  }

  update() {
    const now = performance.now();
    this.calculateFrameRate(now);
    this.startTime = now;
    this.onUpdate(this.frameRate);
  }

  calculateFrameRate(now: number) {
    this.frameRate = Math.round(3600 / (now - this.startTime));
  }
}
