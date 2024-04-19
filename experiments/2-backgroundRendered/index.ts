import { GpuApp, shaders as gpuShaders, color } from "../../dist/gpu-app.es";
import type { UiData } from "../ui/uiData";
import { ColorShifter } from "../shared/colorShifter";
import { Uniform } from "../../lib/gpuApp/buffers/uniform";
import backgroundShader from "./background.wgsl?raw";
import triangleShader from "../shared/shaders/staticTriangle.wgsl?raw";

const backgroundShaders = [gpuShaders.premultiply, backgroundShader];
const triangleShaders = [gpuShaders.premultiply, triangleShader];

export const renderBackgroundRectangleInGpu = (
  gpuApp: GpuApp,
  uiData: UiData,
) => {
  const colorShifter = new ColorShifter();
  const colorUniform = new Uniform(
    color.colorDictToArray(colorShifter.color, uiData.get("alphaValue")),
    gpuApp,
  );

  const backgroundPipeline = gpuApp.setupRendering(backgroundShaders, [
    colorUniform,
  ]);
  backgroundPipeline.overrideVertexCount(6);

  gpuApp.render((renderer) => {
    uiData.update("frameRate", renderer.frame.rate);
    colorUniform.data = color.colorDictToArray(
      colorShifter.update(),
      uiData.get("alphaValue"),
    );
  });
};

export const renderBackgroundRectangleWithTriangle = (
  gpuApp: GpuApp,
  uiData: UiData,
) => {
  const colorShifter = new ColorShifter();
  const colorUniform = new Uniform(
    color.colorDictToArray(colorShifter.color, uiData.get("alphaValue")),
    gpuApp,
  );

  const backgroundPipeline = gpuApp.setupRendering(backgroundShaders, [
    colorUniform,
  ]);
  backgroundPipeline.overrideVertexCount(6);

  const trianglePipeline = gpuApp.setupRendering(triangleShaders);
  trianglePipeline.overrideVertexCount(3);

  gpuApp.render((renderer) => {
    uiData.update("frameRate", renderer.frame.rate);
    colorUniform.data = color.colorDictToArray(
      colorShifter.update(),
      uiData.get("alphaValue"),
    );
  });
};
