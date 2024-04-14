import type { UiData } from "./uiData";

const template = `
  Frames per second: <span></span>
`;

export type FrameRateDisplayOptions = {
  parentSelector?: string;
  uiData: UiData;
}

const interval = 100; // ms
export class FrameRateDisplay {
  container: HTMLDivElement;
  parentElement: HTMLElement;
  uiData: UiData;
  span!: HTMLSpanElement | null;

  constructor(options: FrameRateDisplayOptions) {
    const parentSelector = options.parentSelector || "#controls";
    this.container = document.createElement("div");
    this.parentElement = document.querySelector(parentSelector) || document.body;
    this.uiData = options.uiData;
  }

  setup() {
    this.buildElement();
    this.appendToBody();
    this.updatePeriodically();
  }

  buildElement() {
    this.container.id = "framerate-display";
    this.container.innerHTML = template;
    this.span = this.container.querySelector("span");
  }

  appendToBody() {
    this.parentElement.append(this.container);
  }

  updatePeriodically() {
    this.update();
    setInterval(() => this.update(), interval);
  }

  update() {
    if (!this.span) return;

    this.span.innerText = this.uiData.get('frameRate').toString();
  }
}

export const addFrameRate = (options: FrameRateDisplayOptions) => {
  const ui = new FrameRateDisplay(options);
  ui.setup();
  return ui;
};
