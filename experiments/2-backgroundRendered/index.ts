import { GpuApp, shaders as gpuShaders } from "../../dist/gpu-app.es";
import type { UiData } from "../ui/uiData";
import { ColorShifter, colorDictToArray } from "../shared/colorShifter";
import { Uniform } from "../../lib/gpuApp/buffers/uniform";
import backgroundShader from "./background.wgsl?raw";

const { premultiply } = gpuShaders;
const shaders = [premultiply, backgroundShader];

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
