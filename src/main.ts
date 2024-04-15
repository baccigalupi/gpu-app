import "./style.css";

import { GpuApp, gpuApp } from "./gpuApp.ts";
import { addFrameRate } from "./examples/ui/frameRateDisplay.ts";
import { buildUiData } from "./examples/ui/uiData.ts";
import { addOpacityControls } from "./examples/ui/opacityControls.ts";

import { getGpuApp } from "./examples/ui/routes.ts";
import { renderHomePage } from "./examples/ui/home.ts";

const page = getGpuApp();

declare global {
  interface Window { gpuApp: GpuApp; }
}

if (page) {
  const uiData = buildUiData();
  const app = await gpuApp({ parentSelector: "#canvas-container" });
  window.gpuApp = app;
  addFrameRate({ uiData });
  addOpacityControls({ uiData, gpuApp: app });
  page(app, uiData);
} else {
  renderHomePage();
}
