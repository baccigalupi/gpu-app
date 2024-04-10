const template = `
  Frames per second: <span></span>
`

const styles: Record<string, string> = {
  position: 'absolute',
  right: '0',
  top: '0',
  width: '200px',
  height: '30px',
  "background-color": 'black',
  padding: "5px 0 0 20px",
}

export class FrameRateUi {
  container: HTMLDivElement;
  span!: HTMLSpanElement | null;
  lastUpdated: number;

  constructor() {
    this.container = document.createElement("div");
    this.lastUpdated = 0;
  }

  setup() {
    this.buildElement();
    this.appendToBody();
  }

  buildElement() {
    this.container.innerHTML = template;
    
    const cssStyles = Object.keys(styles).map((key: string) => {
      return `${key}: ${styles[key]}`;
    }).join(";")

    this.container.style.cssText = cssStyles;
    this.span = this.container.querySelector('span');
  }

  appendToBody() {
    document.body.append(this.container);
  }

  update(frameRate: number) {
    if (!this.span || this.shouldDelay()) return;

    this.span.innerText = frameRate.toString();
    this.lastUpdated = performance.now();
  }

  shouldDelay() {
    const now = performance.now();
    return now - this.lastUpdated < 70;
  }
}

export const addFrameRate = () => {
  const ui = new FrameRateUi();
  ui.setup();
  return ui;
}