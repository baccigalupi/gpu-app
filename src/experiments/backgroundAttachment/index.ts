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

  gpuApp.setBackgroundColor(backgroundColor());
  gpuApp.setupRendering(shaders);
  gpuApp.render((renderer) => {
    uiData.update("frameRate", renderer.frame.rate);
    renderer.backgroundColor = backgroundColor();
  });
};

export const renderBackgroundOnly = (gpuApp: GpuApp, uiData: UiData) => {
  const colorShifter = new ColorShifter();
  const backgroundColor = () => {
    return normalizeColor(colorShifter.color, uiData.get("alphaMode"));
  }

  gpuApp.setBackgroundColor(backgroundColor());
  gpuApp.setupRendering(shaders);
  gpuApp.render((renderer) => {
    uiData.update("frameRate", renderer.frame.rate);
    colorShifter.update(uiData.get("alphaValue"));
    renderer.backgroundColor = backgroundColor();
  });
};

export const renderBackgroundAndTriangle = (gpuApp: GpuApp, uiData: UiData) => {
  const colorShifter = new ColorShifter();
  const backgroundColor = () => {
    return normalizeColor(colorShifter.color, uiData.get("alphaMode"));
  }

  gpuApp.setBackgroundColor(backgroundColor());
  const pipeline = gpuApp.setupRendering(shaders);
  pipeline.overrideVertexCount(3);

  gpuApp.render((renderer) => {
    uiData.update("frameRate", renderer.frame.rate);
    colorShifter.update(uiData.get("alphaValue"));
    renderer.backgroundColor = backgroundColor();
  });
};
