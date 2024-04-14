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

      <div class="form-group">
        <label for='alhpa'>Alpha value <span id="alpha-display">0.95</span><label><br>
        <input type="range" name="alphaValue" id="alphaValue" min="0.0" max="1.0" value="0.95" step="0.01" />
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
  alphaDisplay!: HTMLSpanElement | null;
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
    this.listenForAlphaValueUpdates();
  }

  listenForAlphaValueUpdates() {    
    const rangeInput = this.container.querySelector("input[type=range]")
    if (rangeInput) {
      rangeInput.addEventListener('change', ({target}: Event) => {
        if (!target || !this.alphaDisplay) return;

        this.alphaDisplay.innerText = (target as HTMLInputElement).value;
      });
    }
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
