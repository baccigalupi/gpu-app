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
    colorDictToArray(colorShifter.color, uiData.get("alphaValue")),
    gpuApp,
  );

  const pipeline = gpuApp.setupRendering(shaders, [colorUniform]);
  pipeline.overrideVertexCount(6);

  gpuApp.render((renderer) => {
    uiData.update("frameRate", renderer.frame.rate);
    colorUniform.data = colorDictToArray(
      colorShifter.update(),
      uiData.get("alphaValue"),
    );
  });
};
