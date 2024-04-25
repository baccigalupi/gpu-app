import type { GpuApp } from "../../lib/gpuApp/facade";
import type { UiData } from "../ui/uiData";
import { shaders as gpuShaders } from "../../lib/gpuApp/shaders";
import { ColorModel } from "../../lib/gpuApp/models/color";
import { point } from "../../lib/gpuApp/models/point";
import { quad } from "../../lib/gpuApp/models/quad";
import { ColorShifter } from "../shared/colorModelShifter";

import backgroundShader from "./background.wgsl?raw";
import triangleShader from "../shared/shaders/staticTriangle.wgsl?raw";

const backgroundShaders = [gpuShaders.premultiply, backgroundShader];
const triangleShaders = [gpuShaders.premultiply, triangleShader];

export const renderBackgroundRectangleInGpu = (
  gpuApp: GpuApp,
  uiData: UiData,
) => {
  const colorModel = ColorModel.fromDecimals(0.75, 0.25, 0.25, uiData.get("alphaValue"));
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
  const backgroundColor = ColorModel.fromDecimals(0.25, 0.25, 0.25, uiData.get("alphaValue"));
  backgroundColor.asUniform(gpuApp.device);

  const background = quad(
    point(-1, -1),
    point(1, -1),
    point(1, 1),
    point(-1, 1),
  );
  // background.asVertex(gpuApp.device);

  const backgroundPipeline = gpuApp.setupRendering(backgroundShaders, [
    backgroundColor,
  ]);
  backgroundPipeline.overrideVertexCount(6);

  const trianglePipeline = gpuApp.setupRendering(triangleShaders);
  trianglePipeline.overrideVertexCount(3);
  trianglePipeline.blend("translucent");

  gpuApp.render((renderer) => {
    uiData.update("frameRate", renderer.frame.rate);
    backgroundColor.a = uiData.get("alphaValue");
  });
};
