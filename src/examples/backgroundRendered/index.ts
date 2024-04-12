import type { GpuApp } from "../../gpuApp";
import { addFrameRate } from "../shared/frameRateUi";
import { ColorShifter } from "../shared/colorShifter";
import { Uniform } from '../../gpuApp/buffers/uniform';
import shaders from "./shader.wgsl?raw";

const colorDictToArray = (colorDict: GPUColorDict): number[] => {
  return [colorDict.r, colorDict.g, colorDict.b, colorDict.a];
}

export const renderBackgroundRectangleInGpu = (gpuApp: GpuApp) => {
  const colorShifter = new ColorShifter();
  const colorUniform = new Uniform(
    colorDictToArray(colorShifter.color),
    gpuApp,
    { label: 'uniform: background color' }
  )
  // const backgroundColor = new Uniform();
  const frameRateUi = addFrameRate();

  const pipeline = gpuApp.setupRendering({
    shaders,
    backgroundColor: colorShifter.color,
    buffers: [colorUniform],
  });

  pipeline.calculateStats((frameRate: number) => frameRateUi.update(frameRate));
  pipeline.overrideVertexCount(6);

  pipeline.renderLoop(() => {
    colorUniform.data = colorDictToArray(colorShifter.update());
  });
};
