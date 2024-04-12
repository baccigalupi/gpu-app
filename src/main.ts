import "./style.css";
import { gpuApp } from "./gpuApp.ts";
import { renderBackgroundAndTriangle, renderBackgroundOnly, renderBackgroundOnlyStatic } from "./examples/backgroundAttachment/index.ts";
import { renderBackgroundRectangleInGpu } from "./examples/backgroundRendered/index.ts";

const gpu = await gpuApp({parentSelector: "#canvas-container"});

// renderBackgroundOnlyStatic(gpu);
renderBackgroundOnly(gpu);
// renderBackgroundAndTriangle(gpu);

// renderBackgroundRectangleInGpu(gpu);


