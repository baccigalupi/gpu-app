export type OnFrameUpdate = (fram: Frame) => void;
const nullUpdater = (_frame: Frame) => {};

export class Frame {
  startTime: number;
  rate: number;
  deltaTime: number;
  onUpdate: OnFrameUpdate;

  constructor(onUpdate: OnFrameUpdate = nullUpdater) {
    this.startTime = performance.now();
    this.rate = 0;
    this.deltaTime = 1;
    this.onUpdate = onUpdate;
  }

  update(now: number = performance.now()) {
    this.calculate(now);
    this.startTime = now;
    this.onUpdate(this);
  }

  calculate(now: number) {
    this.deltaTime = now - this.startTime;
    this.rate = Math.round(3600 / this.deltaTime);
  }
}
