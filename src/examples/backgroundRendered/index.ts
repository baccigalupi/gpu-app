import type { GpuApp } from "../../gpuApp";
import { addFrameRate } from "../shared/frameRateUi";
import { ColorShifter } from "../shared/colorShifter";
import shaders from "./staticTriangle.wgsl?raw";

export const render = (gpuApp: GpuApp) => {
  const colorShifter = new ColorShifter();
  const frameRateUi = addFrameRate();

  const pipeline = gpuApp.setupRendering({
    shaders,
    backgroundColor: colorShifter.color,
  });

  pipeline.calculateStats((frameRate: number) => frameRateUi.update(frameRate));
  pipeline.overrideVertexCount(3);

  pipeline.renderLoop();
};
