import "./style.css";

import { gpuApp } from "./gpuApp.ts";
import { addFrameRate } from "./examples/ui/frameRateDisplay.ts";
import { buildUiData } from "./examples/ui/uiData.ts";
import { addOpacityControls } from "./examples/ui/opacityControls.ts";

import {
  renderBackgroundAndTriangle,
  renderBackgroundOnly,
  renderBackgroundOnlyStatic
} from "./examples/backgroundAttachment/index.ts";

import {
  renderBackgroundRectangleInGpu
} from "./examples/backgroundRendered/index.ts";

const gpu = await gpuApp({parentSelector: "#canvas-container"});
const frameRateDisplay = addFrameRate();
const uiData = buildUiData();
addOpacityControls({ uiData });

// renderBackgroundOnlyStatic(gpu, FrameRateDisplay);
// renderBackgroundOnly(gpu, FrameRateDisplay);
// renderBackgroundAndTriangle(gpu, FrameRateDisplay);
renderBackgroundRectangleInGpu(gpu, frameRateDisplay, uiData);


