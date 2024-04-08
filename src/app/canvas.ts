export class SetupCanvasElement {
  parentSelector!: string;
  element!: HTMLCanvasElement;

  constructor(parentSelector: string) {
    this.parentSelector = parentSelector;
  }

  getParent() {
    return document.querySelector(this.parentSelector);
  }

  addElementToDom() {
    const parent = this.getParent()
    if (parent) {
      this.element = document.createElement("canvas");
      this.element.width = 1000;
      this.element.height = 800;
      parent.appendChild(this.element);
    } else {
      console.error("canvas not created");
    }
  }
}

export const setupCanvas = (parentSelector: string = "#app") => {
  const builder = new SetupCanvasElement(parentSelector);
  builder.addElementToDom();
  return builder.element;
}