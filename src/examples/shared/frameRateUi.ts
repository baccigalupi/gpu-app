const template = `
  Frames per second: <span></span>
`;

const styles: Record<string, string> = {
  padding: "20px",
};

export class FrameRateUi {
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
    this.container.innerHTML = template;

    const cssStyles = Object.keys(styles)
      .map((key: string) => {
        return `${key}: ${styles[key]}`;
      })
      .join(";");

    this.container.style.cssText = cssStyles;
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

  shouldDelay() {
    const now = performance.now();
    return now - this.lastUpdated < 100;
  }
}

export const addFrameRate = () => {
  const ui = new FrameRateUi();
  ui.setup();
  return ui;
};
