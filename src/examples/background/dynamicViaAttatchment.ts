import { GpuApp } from "../../gpuApp";
import { setupRenderPipeline } from "../../gpuApp/renderPipeline";
import { ColorShifter } from "./colorShifter";
import shaders from "./staticTriangle.wgsl?raw";

export const dynamicBackground = (gpuApp: GpuApp) => {
  const colorShifter = new ColorShifter();

  const pipeline = setupRenderPipeline({
    gpuApp,
    shaders,
    backgroundColor: colorShifter.color,
  });

  pipeline.renderLoop(() => {
    pipeline.backgroundColor = colorShifter.update();
  });
};
