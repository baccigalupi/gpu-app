import "./style.css";

import { GpuApp, gpuApp } from "../lib/gpuApp/facade";
import { addFrameRate } from "./ui/frameRateDisplay";
import { buildUiData } from "./ui/uiData";
import { addOpacityControls } from "./ui/opacityControls";

import { getGpuApp } from "./ui/routes";
import { renderHomePage } from "./ui/home";

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
