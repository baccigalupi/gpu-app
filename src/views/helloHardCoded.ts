import { GpuApp } from "../gpuApp";
import { setupRenderPipeline } from "../gpuApp/renderPipeline";
import shaders from "../shaders/helloHardCoded.wgsl?raw";

export const helloHardCoded = (gpuApp: GpuApp) => {
  const backgroundColor = {
    r: 0.1172,
    g: 0.1602,
    b: 0.2304,
    a: 1.0,
  };

  const pipeline = setupRenderPipeline({
    gpuApp,
    shaders,
    backgroundColor,
  });

  pipeline.render();
};
