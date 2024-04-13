import type { GpuApp } from "../../gpuApp";
import type { FrameRateDisplay } from "../ui/frameRateDisplay";
import type { UiData } from "../ui/uiData";
import { ColorShifter, colorDictToArray } from "../shared/colorShifter";
import { Uniform } from '../../gpuApp/buffers/uniform';
import shaders from "./background.wgsl?raw";

const alpha = 0.95;

export const renderBackgroundRectangleInGpu = (gpuApp: GpuApp, FrameRateDisplay: FrameRateDisplay, uiData: UiData) => {
  const colorShifter = new ColorShifter();
  const colorUniform = new Uniform(
    colorDictToArray(colorShifter.color, alpha),
    gpuApp,
  )

  const pipeline = gpuApp.setupRendering({
    shaders,
    backgroundColor: colorShifter.color,
    buffers: [colorUniform],
  });

  pipeline.calculateStats(FrameRateDisplay.updater());
  pipeline.overrideVertexCount(6);

  pipeline.renderLoop(() => {
    colorUniform.data = colorDictToArray(colorShifter.update(), alpha);
  });
};
