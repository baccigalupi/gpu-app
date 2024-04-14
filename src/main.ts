import "./style.css";

import { gpuApp } from "./gpuApp.ts";
import { addFrameRate } from "./examples/ui/frameRateDisplay.ts";
import { buildUiData } from "./examples/ui/uiData.ts";
import { addOpacityControls } from "./examples/ui/opacityControls.ts";

import examples from "./examples/index";

const gpu = await gpuApp({parentSelector: "#canvas-container"});
const uiData = buildUiData();

addFrameRate({ uiData });
addOpacityControls({ uiData });

// examples.backgroundViaAttachment.static(gpu, uiData);
// examples.backgroundViaAttachment.changing(gpu, uiData);
// examples.backgroundViaAttachment.withTriangle(gpu, uiData);

examples.renderedBackground.changing(gpu, uiData);
