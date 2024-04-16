import type { GpuApp } from "../../gpuApp";
import type { UiData } from "../ui/uiData";
import { ColorShifter, colorDictToArray } from "../shared/colorShifter";
import { Uniform } from "../../gpuApp/buffers/uniform";
import shaders from "./background.wgsl?raw";

export const renderBackgroundRectangleInGpu = (
  gpuApp: GpuApp,
  uiData: UiData,
) => {
  const colorShifter = new ColorShifter();
  const colorUniform = new Uniform(
    colorDictToArray(colorShifter.color, uiData.get("alphaValue") || 0.95),
    gpuApp,
  );

  const pipeline = gpuApp.addPipeline({
    shaders,
    backgroundColor: colorShifter.color,
    buffers: [colorUniform],
  });

  pipeline.calculateStats((frameRate) => uiData.update("frameRate", frameRate));
  pipeline.overrideVertexCount(6);

  pipeline.renderLoop(() => {
    colorUniform.data = colorDictToArray(
      colorShifter.update(),
      uiData.get("alphaValue") || 0.95,
    );
  });
};
