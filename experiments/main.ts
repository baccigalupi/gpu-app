import "./style.css";

import { GpuApp, gpuApp } from "../dist/gpu-app.es.js";
import { addFrameRate } from "./ui/frameRateDisplay.ts";
import { buildUiData } from "./ui/uiData.ts";
import { addOpacityControls } from "./ui/opacityControls.ts";

import { getGpuApp } from "./ui/routes.ts";
import { renderHomePage } from "./ui/home.ts";

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
