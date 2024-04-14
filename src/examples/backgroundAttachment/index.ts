import type { GpuApp } from "../../gpuApp";
import type { UiData } from "../ui/uiData";

import { ColorShifter } from "../shared/colorShifter";
import triangle from "./staticTriangle.wgsl?raw";
import premultiply from "../shaders/premultiply.wgsl?raw";

const shaders = [premultiply, triangle];

export const renderBackgroundOnlyStatic = (gpuApp: GpuApp, uiData: UiData) => {
  const pipeline = gpuApp.setupRendering({
    shaders,
    backgroundColor: { r: 0.5, g: 0.5, b: 0.5, a: uiData.get('alphaValue') },
  });
  pipeline.calculateStats((frameRate) => uiData.update('frameRate', frameRate));

  pipeline.renderLoop(() => {
    pipeline.backgroundColor = {
      r: 1.0,
      g: 0.5,
      b: 0.5,
      a: uiData.get('alphaValue')
    };
  });
};

export const renderBackgroundOnly = (gpuApp: GpuApp, uiData: UiData) => {
  const colorShifter = new ColorShifter();
  const pipeline = gpuApp.setupRendering({
    shaders,
    backgroundColor: colorShifter.color,
  });
  pipeline.calculateStats((frameRate) => uiData.update('frameRate', frameRate));

  pipeline.renderLoop(() => {
    pipeline.backgroundColor = colorShifter.update(uiData.get('alphaValue'));
  });
};

export const renderBackgroundAndTriangle = (gpuApp: GpuApp, uiData: UiData) => {
  const colorShifter = new ColorShifter();
  const pipeline = gpuApp.setupRendering({
    shaders,
    backgroundColor: colorShifter.color,
  });
  pipeline.calculateStats((frameRate) => uiData.update('frameRate', frameRate));
  pipeline.overrideVertexCount(3);

  pipeline.renderLoop(() => {
    pipeline.backgroundColor = colorShifter.update(uiData.get('alphaValue'));
  });
};
