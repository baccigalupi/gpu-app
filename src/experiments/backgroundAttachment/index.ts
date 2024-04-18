import type { GpuApp } from "../../gpuApp";
import type { UiData } from "../ui/uiData";

import { ColorShifter } from "../shared/colorShifter";
import { normalizeColor } from "../../gpuApp/color";
import premultiplyShader from "../shaders/premultiply.wgsl?raw";
import triangleShader from "./staticTriangle.wgsl?raw";

const shaders = [premultiplyShader, triangleShader];

export const renderBackgroundOnlyStatic = (gpuApp: GpuApp, uiData: UiData) => {
  const backgroundColor = () => {
    const color = { r: 0.95, g: 0.25, b: 0.25, a: uiData.get("alphaValue") };
    return normalizeColor(color, uiData.get("alphaMode"));
  };

  const pipeline = gpuApp.setupRendering({
    shaders,
    backgroundColor: backgroundColor(),
  });

  pipeline.renderLoop((renderer) => {
    uiData.update("frameRate", renderer.frame.rate);
    pipeline.backgroundColor = backgroundColor();
  });
};

export const renderBackgroundOnly = (gpuApp: GpuApp, uiData: UiData) => {
  const colorShifter = new ColorShifter();
  const pipeline = gpuApp.setupRendering({
    shaders,
    backgroundColor: colorShifter.color,
  });

  pipeline.renderLoop((renderer) => {
    uiData.update("frameRate", renderer.frame.rate);
    pipeline.backgroundColor = normalizeColor(
      colorShifter.update(uiData.get("alphaValue")),
      uiData.get("alphaMode"),
    );
  });
};

export const renderBackgroundAndTriangle = (gpuApp: GpuApp, uiData: UiData) => {
  const colorShifter = new ColorShifter();
  const pipeline = gpuApp.setupRendering({
    shaders,
    backgroundColor: colorShifter.color,
  });
  pipeline.overrideVertexCount(3);

  pipeline.renderLoop((renderer) => {
    uiData.update("frameRate", renderer.frame.rate);
    pipeline.backgroundColor = normalizeColor(
      colorShifter.update(uiData.get("alphaValue")),
      uiData.get("alphaMode"),
    );
  });
};
