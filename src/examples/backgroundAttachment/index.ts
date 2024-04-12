import type { GpuApp } from "../../gpuApp";
import { addFrameRate } from "../shared/frameRateUi";
import { ColorShifter } from "../shared/colorShifter";
import shaders from "./staticTriangle.wgsl?raw";

export const renderBackgroundOnlyStatic = (gpuApp: GpuApp) => {
  const frameRateUi = addFrameRate();

  const pipeline = gpuApp.setupRendering({
    shaders,
    backgroundColor: { r: 0.5, g: 0.5, b: 0.5, a: 0.75 },
  });
  pipeline.calculateStats((frameRate: number) => frameRateUi.update(frameRate));

  pipeline.renderLoop();
};

export const renderBackgroundOnly = (gpuApp: GpuApp) => {
  const frameRateUi = addFrameRate();

  const colorShifter = new ColorShifter();
  const pipeline = gpuApp.setupRendering({
    shaders,
    backgroundColor: colorShifter.color,
  });
  pipeline.calculateStats((frameRate: number) => frameRateUi.update(frameRate));

  pipeline.renderLoop(() => {
    pipeline.backgroundColor = colorShifter.update();
  });
};

export const renderBackgroundAndTriangle = (gpuApp: GpuApp) => {
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
