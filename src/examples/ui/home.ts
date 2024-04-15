import template from "./home.html?raw";

export class Home {
  container: HTMLDivElement;
  parentElement: HTMLElement;

  constructor(parentSelector: string = "#canvas-container") {
    this.container = document.createElement("div");
    this.parentElement =
      document.querySelector(parentSelector) || document.body;
  }

  setup() {
    this.buildElement();
    this.appendToBody();
  }

  buildElement() {
    this.container.id = "home";
    this.container.innerHTML = template;
  }

  appendToBody() {
    this.parentElement.append(this.container);
  }
}

export const renderHomePage = () => {
  const page = new Home();
  page.setup();
};
