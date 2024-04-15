export class Canvas {
  parentSelector!: string;
  width: number;
  height: number;
  element!: HTMLCanvasElement;
  context!: GPUCanvasContext | null;

  constructor(parentSelector: string) {
    this.parentSelector = parentSelector;
    this.width = 1000;
    this.height = 800;
  }

  setup() {
    this.addElementToDom();
    this.getContext();
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

  getAdjustedDimensions() {
    return {
      width: this.adjustedWidth(),
      height: this.adjustedHeight(),
    };
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
    if (this.context) return this.context;
    if (!this.element) return;

    this.context = this.element.getContext("webgpu") as GPUCanvasContext;
    return this.context;
  }

  reset() {
    this.context = null;
    this.element.remove();
    this.setup();
  }
}

export const setupCanvas = (parentSelector = "#app") => {
  const canvas = new Canvas(parentSelector);
  canvas.addElementToDom();
  canvas.getContext();
  return canvas;
};
