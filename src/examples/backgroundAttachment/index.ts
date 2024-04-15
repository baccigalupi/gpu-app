import type { GpuApp } from "../../gpuApp";
import type { UiData } from "../ui/uiData";

import { ColorShifter } from "../shared/colorShifter";
import triangle from "./staticTriangle.wgsl?raw";
import premultiply from "../shaders/premultiply.wgsl?raw";

const shaders = [premultiply, triangle];

export const renderBackgroundOnlyStatic = (gpuApp: GpuApp, uiData: UiData) => {
  const backgroundColor = () => (
    { r: 0.95, g: 0.25, b: 0.25, a: uiData.get('alphaValue') }
  )
  const pipeline = gpuApp.setupRendering({
    shaders,
    backgroundColor: backgroundColor(),
  });
  pipeline.calculateStats((frameRate) => uiData.update('frameRate', frameRate));

  pipeline.renderLoop(() => { pipeline.backgroundColor = backgroundColor() });
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
