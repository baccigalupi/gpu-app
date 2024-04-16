import "./style.css";

import { GpuApp, gpuApp } from "./gpuApp.ts";
import { addFrameRate } from "./experiments/ui/frameRateDisplay.ts";
import { buildUiData } from "./experiments/ui/uiData.ts";
import { addOpacityControls } from "./experiments/ui/opacityControls.ts";

import { getGpuApp } from "./experiments/ui/routes.ts";
import { renderHomePage } from "./experiments/ui/home.ts";

const page = getGpuApp();

declare global {
  interface Window {
    gpuApp: GpuApp;
  }
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
