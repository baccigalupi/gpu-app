import type { UiData } from "./uiData";
const template = `
  <form action="javascript:void(0)">
    <fieldset>
      <legend>Canvas opacity settings</legend>
      <div>
        <input type="radio" name="alphaMode" value="premultiplied" id="alpha-premultiplied" checked/>
        <label for="alpha-premultiplied">premultiplied</label>
      </div>
      <div>
        <input type="radio" name="alphaMode" value="opaque" id="alpha-opaque"/>
        <label for="alpha-opaque">opaque</label>
      </div>
    </fieldset>
  </form>
`;

type OpacityControlsOptions = {
  uiData: UiData;
  parentSelector?: string;
};

export class OpacityControls {
  container: HTMLDivElement;
  parentElement: HTMLElement;
  uiData: UiData;

  constructor(options: OpacityControlsOptions) {
    const parentSelector = options.parentSelector || "#controls";
    this.container = document.createElement("div");
    this.parentElement = document.querySelector(parentSelector) || document.body;
    this.uiData = options.uiData;
  }

  setup() {
    this.buildElement();
    this.appendToBody();
  }

  buildElement() {
    this.container.id = "opacity-controls";
    this.container.innerHTML = template;
    const inputs = this.container.querySelectorAll("input");
    inputs.forEach((input) => {
      input.addEventListener('change', this.uiData.updater('canvasAlphaMode'));
    });
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
