import type { GpuApp } from "../../lib/gpuApp/facade";
import type { UiData } from "../ui/uiData";
import { shaders as gpuShaders } from "../../lib/gpuApp/shaders";
import { ColorModel } from "../../lib/gpuApp/models/color";
import { point } from "../../lib/gpuApp/models/point";
import { quad } from "../../lib/gpuApp/models/quad";
import backgroundShader from "./background.wgsl?raw";
import triangleShader from "../shared/shaders/staticTriangle.wgsl?raw";

const backgroundShaders = [gpuShaders.premultiply, backgroundShader];
const triangleShaders = [gpuShaders.premultiply, triangleShader];

export const renderBackgroundRectangleInGpu = (
  gpuApp: GpuApp,
  uiData: UiData,
) => {
  const backgroundColor = ColorModel.named("White", uiData.get("alphaValue"));
  backgroundColor.asUniform();

  const backgroundShape = quad(
    point(-1, -1),
    point(1, -1),
    point(1, 1),
    point(-1, 1),
  );
  backgroundShape.asVertex(gpuApp.device);

  const backgroundPipeline = gpuApp.addPipeline(backgroundShaders, [
    // backgroundShape,
    backgroundColor,
  ]);
  backgroundPipeline.overrideVertexCount(6);

  gpuApp.render((renderer) => {
    uiData.update("frameRate", renderer.frame.rate);
    backgroundColor.a = uiData.get("alphaValue");
  });
};

export const renderBackgroundRectangleWithTriangle = (
  gpuApp: GpuApp,
  uiData: UiData,
) => {
  const backgroundColor = ColorModel.fromDecimals(1, 1, 1, uiData.get("alphaValue"));
  backgroundColor.asUniform(gpuApp.device);

  const backgroundShape = quad(
    point(-1, -1),
    point(1, -1),
    point(1, 1),
    point(-1, 1),
  );
  backgroundShape.asVertex(gpuApp.device);

  const backgroundPipeline = gpuApp.addPipeline(backgroundShaders, [
    backgroundColor,
  ]);
  backgroundPipeline.overrideVertexCount(6);

  const trianglePipeline = gpuApp.addPipeline(triangleShaders);
  trianglePipeline.overrideVertexCount(3);
  trianglePipeline.blend("translucent");

  gpuApp.render((renderer) => {
    uiData.update("frameRate", renderer.frame.rate);
    backgroundColor.a = uiData.get("alphaValue");
  });
};
