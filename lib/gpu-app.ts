import { gpuApp } from "./gpuApp/facade";
export default gpuApp;

export { GpuApp, gpuApp } from "./gpuApp/facade";
export { Canvas, setupCanvas } from "./gpuApp/canvas";
export { SetupDevice, setupDevice } from "./gpuApp/device";
export { FrameInfo } from "./gpuApp/frameInfo";
export { Renderer } from "./gpuApp/renderer";
export { RenderPipeline } from "./gpuApp/renderPipeline";
export { Shader } from "./gpuApp/shader";

export * as color from "./gpuApp/color";
export { shaders } from "./gpuApp/shaders.ts";
