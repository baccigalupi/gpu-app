const template = `
  Frames per second: <span></span>
`;

export class FrameRateDisplay {
  container: HTMLDivElement;
  span!: HTMLSpanElement | null;
  parentElement: HTMLElement;
  lastUpdated: number;

  constructor(parentSelector: string = "#controls") {
    this.container = document.createElement("div");
    this.lastUpdated = 0;
    this.parentElement = document.querySelector(parentSelector) || document.body;
  }

  setup() {
    this.buildElement();
    this.appendToBody();
  }

  buildElement() {
    this.container.id = "framerate-display";
    this.container.innerHTML = template;
    this.span = this.container.querySelector("span");
  }

  appendToBody() {
    this.parentElement.append(this.container);
  }

  update(frameRate: number) {
    if (!this.span || this.shouldDelay()) return;

    this.span.innerText = frameRate.toString();
    this.lastUpdated = performance.now();
  }

  updater() {
    return (frameRate: number) => this.update(frameRate);
  }

  shouldDelay() {
    const now = performance.now();
    return now - this.lastUpdated < 100;
  }
}

export const addFrameRate = (parentSelector: string = "#controls") => {
  const ui = new FrameRateDisplay(parentSelector);
  ui.setup();
  return ui;
};
