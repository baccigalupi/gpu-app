export class SetupCanvas {
  parentSelector!: string;
  element!: HTMLCanvasElement;
  width: number;
  height: number;

  constructor(parentSelector: string) {
    this.parentSelector = parentSelector;
    this.width = 1000;
    this.height = 800;
  }

  getParent() {
    return document.querySelector(this.parentSelector);
  }

  addElementToDom() {
    const parent = this.getParent();
    if (parent) {
      this.element = document.createElement("canvas");
      parent.appendChild(this.element);
      this.resize();
    } else {
      console.error("canvas not created");
    }
  }

  getDimensions() {
    const { height, width } = this.element.getBoundingClientRect();
    this.width = width;
    this.height = height;

    return { height, width };
  }

  aspect() {
    return this.width / this.height;
  }

  adjustedWidth() {
    return this.width * window.devicePixelRatio;
  }

  adjustedHeight() {
    return this.height * window.devicePixelRatio;
  }

  resize() {
    this.getDimensions();
    this.element.width = this.adjustedWidth();
    this.element.height = this.adjustedHeight();
  }

  getContext() {
    return this.element.getContext("webgpu");
  }
}

export const setupCanvas = (parentSelector: string = "#app") => {
  const builder = new SetupCanvas(parentSelector);
  builder.addElementToDom();
  return builder.element;
};
