import type { GpuApp } from "../../gpuApp";
import type { FrameRateDisplay } from "../ui/frameRateDisplay";
import { ColorShifter } from "../shared/colorShifter";
import shaders from "./staticTriangle.wgsl?raw";

export const renderBackgroundOnlyStatic = (gpuApp: GpuApp, FrameRateDisplay: FrameRateDisplay) => {
  const pipeline = gpuApp.setupRendering({
    shaders,
    backgroundColor: { r: 0.5, g: 0.5, b: 0.5, a: 0.75 },
  });
  pipeline.calculateStats(FrameRateDisplay.updater());

  pipeline.renderLoop();
};

export const renderBackgroundOnly = (gpuApp: GpuApp, FrameRateDisplay: FrameRateDisplay) => {
  const colorShifter = new ColorShifter();
  const pipeline = gpuApp.setupRendering({
    shaders,
    backgroundColor: colorShifter.color,
  });
  pipeline.calculateStats(FrameRateDisplay.updater());

  pipeline.renderLoop(() => {
    pipeline.backgroundColor = colorShifter.update();
  });
};

export const renderBackgroundAndTriangle = (gpuApp: GpuApp, FrameRateDisplay: FrameRateDisplay) => {
  const colorShifter = new ColorShifter();
  const pipeline = gpuApp.setupRendering({
    shaders,
    backgroundColor: colorShifter.color,
  });
  pipeline.calculateStats(FrameRateDisplay.updater());
  pipeline.overrideVertexCount(3);

  pipeline.renderLoop(() => {
    pipeline.backgroundColor = colorShifter.update();
  });
};
