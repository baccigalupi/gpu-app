import type { GpuApp } from "../../gpuApp";
import { addFrameRate } from "../frameRateUi";
import { ColorShifter } from "./colorShifter";
import shaders from "./staticTriangle.wgsl?raw";

export const render = (gpuApp: GpuApp) => {
  const frameRateUi = addFrameRate();

  const colorShifter = new ColorShifter();
  const pipeline = gpuApp.setupRendering({
    shaders,
    backgroundColor: colorShifter.color,
  });
  pipeline.calculateStats((frameRate: number) => frameRateUi.update(frameRate));
  pipeline.overrideVertexCount(3);

  pipeline.renderLoop(() => {
    pipeline.backgroundColor = colorShifter.update();
  });
};
