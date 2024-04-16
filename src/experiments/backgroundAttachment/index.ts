import type { GpuApp } from "../../gpuApp";
import type { UiData } from "../ui/uiData";

import { ColorShifter } from "../shared/colorShifter";
import { premultiply } from "../../gpuApp/shaderEquivalentFunctions";
import premultiplyShader from "../shaders/premultiply.wgsl?raw";
import triangleShader from "./staticTriangle.wgsl?raw";

const shaders = [premultiplyShader, triangleShader];

export const renderBackgroundOnlyStatic = (gpuApp: GpuApp, uiData: UiData) => {
  const backgroundColor = () => {
    const color = { r: 0.95, g: 0.25, b: 0.25, a: uiData.get("alphaValue") };

    if (uiData.get("alphaMode") === "opaque") {
      return color;
    } else {
      return premultiply(color);
    }
  };

  const pipeline = gpuApp.addPipeline({
    shaders,
    backgroundColor: backgroundColor(),
  });
  pipeline.calculateStats((frameRate) => uiData.update("frameRate", frameRate));

  pipeline.renderLoop(() => {
    pipeline.backgroundColor = backgroundColor(); // to take 
  });
};

export const renderBackgroundOnly = (gpuApp: GpuApp, uiData: UiData) => {
  const colorShifter = new ColorShifter();
  const pipeline = gpuApp.addPipeline({
    shaders,
    backgroundColor: colorShifter.color,
  });
  pipeline.calculateStats((frameRate) => uiData.update("frameRate", frameRate));

  pipeline.renderLoop(() => {
    pipeline.backgroundColor = colorShifter.update(uiData.get("alphaValue"));
  });
};

export const renderBackgroundAndTriangle = (gpuApp: GpuApp, uiData: UiData) => {
  const colorShifter = new ColorShifter();
  const pipeline = gpuApp.addPipeline({
    shaders,
    backgroundColor: colorShifter.color,
  });
  pipeline.calculateStats((frameRate) => uiData.update("frameRate", frameRate));
  pipeline.overrideVertexCount(3);

  pipeline.renderLoop(() => {
    pipeline.backgroundColor = colorShifter.update(uiData.get("alphaValue"));
  });
};
