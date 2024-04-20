import type { GpuApp } from "../../lib/gpuApp/facade";
import type { UiData } from "../ui/uiData";
import { shaders as gpuShaders } from "../../lib/gpuApp/shaders";
import { ColorModel } from "../../lib/gpuApp/models/color";
import { ColorShifter } from "../shared/colorShifter2";

import backgroundShader from "./background.wgsl?raw";
import triangleShader from "../shared/shaders/staticTriangle.wgsl?raw";

const backgroundShaders = [gpuShaders.premultiply, backgroundShader];
const triangleShaders = [gpuShaders.premultiply, triangleShader];

export const renderBackgroundRectangleInGpu = (
  gpuApp: GpuApp,
  uiData: UiData,
) => {
  const colorModel = ColorModel.fromDict({
    r: 0.75,
    g: 0.25,
    b: 0.25,
    a: uiData.get("alphaValue"),
  });
  colorModel.asUniform(gpuApp.device);
  const colorShifter = new ColorShifter(colorModel);

  const backgroundPipeline = gpuApp.setupRendering(backgroundShaders, [
    colorModel,
  ]);
  backgroundPipeline.overrideVertexCount(6);

  gpuApp.render((renderer) => {
    uiData.update("frameRate", renderer.frame.rate);
    colorShifter.update(uiData.get("alphaValue"));
  });
};

export const renderBackgroundRectangleWithTriangle = (
  gpuApp: GpuApp,
  uiData: UiData,
) => {
  const colorModel = ColorModel.fromDict({
    r: 0.25,
    g: 0.25,
    b: 0.75,
    a: uiData.get("alphaValue"),
  });
  colorModel.asUniform(gpuApp.device);
  const colorShifter = new ColorShifter(colorModel);

  const backgroundPipeline = gpuApp.setupRendering(backgroundShaders, [
    colorModel,
  ]);
  backgroundPipeline.overrideVertexCount(6);

  const trianglePipeline = gpuApp.setupRendering(triangleShaders);
  trianglePipeline.overrideVertexCount(3);

  gpuApp.render((renderer) => {
    uiData.update("frameRate", renderer.frame.rate);
    colorShifter.update(uiData.get("alphaValue"));
  });
};
