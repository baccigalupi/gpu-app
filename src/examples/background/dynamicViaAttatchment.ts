import { GpuApp } from "../../gpuApp";
import { ColorShifter } from "./colorShifter";
import shaders from "./staticTriangle.wgsl?raw";

export const dynamicBackground = (gpuApp: GpuApp) => {
  const colorShifter = new ColorShifter();

  const pipeline = gpuApp.setupRendering({
    shaders,
    backgroundColor: colorShifter.color,
  });

  pipeline.renderLoop(() => {
    pipeline.backgroundColor = colorShifter.update();
  });
};
