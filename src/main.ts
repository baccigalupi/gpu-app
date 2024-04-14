import "./style.css";

import { gpuApp } from "./gpuApp.ts";
import { addFrameRate } from "./examples/ui/frameRateDisplay.ts";
import { buildUiData } from "./examples/ui/uiData.ts";
import { addOpacityControls } from "./examples/ui/opacityControls.ts";

import { getGpuApp } from "./examples/ui/routes.ts";
import { renderHomePage } from "./examples/ui/home.ts";

const page = getGpuApp();

if (page) {
  const gpu = await gpuApp({parentSelector: "#canvas-container"});
  const uiData = buildUiData();
  addFrameRate({ uiData });
  addOpacityControls({ uiData });
  page(gpu, uiData);
} else {
  renderHomePage();
}
