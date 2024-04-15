import type { GpuApp } from "../../gpuApp";
import type { UiData } from "./uiData";
import template from "./opacityControls.html?raw"

type OpacityControlsOptions = {
  uiData: UiData;
  gpuApp: GpuApp;
  parentSelector?: string;
};

export class OpacityControls {
  uiData: UiData;
  gpuApp: GpuApp;
  container: HTMLDivElement;
  parentElement: HTMLElement;
  alphaDisplay!: HTMLSpanElement | null;
  
  constructor(options: OpacityControlsOptions) {
    this.uiData = options.uiData;
    this.gpuApp = options.gpuApp;

    const parentSelector = options.parentSelector || "#controls";
    this.parentElement = document.querySelector(parentSelector) || document.body;
    this.container = document.createElement("div");
  }

  setup() {
    this.buildElement();
    this.appendToBody();
    this.listenOnInputs();
  }

  buildElement() {
    this.container.id = "opacity-controls";
    this.container.innerHTML = template;
    this.alphaDisplay = this.container.querySelector("#alpha-display");
  }

  listenOnInputs() {
    const inputs = this.container.querySelectorAll("input");
    inputs.forEach((input) => {
      input.addEventListener('change', this.uiData.updater());
    });
    this.listenForModeChanges();
    this.listenForAlphaValueUpdates();
  }

  listenForAlphaValueUpdates() {    
    const rangeInputs = this.container.querySelectorAll("input[type=range]")
    
    rangeInputs.forEach((input) => {
      input.addEventListener('change', ({target}: Event) => {
        if (!target || !this.alphaDisplay) return;
  
        this.alphaDisplay.innerText = (target as HTMLInputElement).value;
      });
    });
  }

  listenForModeChanges() {
    this.container
      .querySelectorAll("input[type=radio]")
      .forEach((input) => {
        input.addEventListener('change', ({target}: Event) => {
          if (!target) return;
          const value = (target as HTMLInputElement).value as GPUCanvasAlphaMode;
          this.gpuApp.resetCanvas(value);
        })
      })
  }

  appendToBody() {
    this.parentElement.append(this.container);
  }
}

export const addOpacityControls = (options: OpacityControlsOptions) => {
  const ui = new OpacityControls(options);
  ui.setup();
  return ui;
};
