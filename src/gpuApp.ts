import { setupCanvas, Canvas } from "./gpuApp/canvas";
import { setupDevice } from "./gpuApp/device";
import { textureInfo, TextureInfo } from "./gpuApp/textureInfo";
import { Shader, Shaders } from "./gpuApp/shader";
import { Pipeline, SetupPipelineArguments } from "./gpuApp/pipeline";

const defaultBackgroundColor = {
  r: 0.5,
  g: 0.5,
  b: 0.5,
  a: 1.0,
};

const defaultCanvasParentSelector = "#app";

export class GpuApp {
  canvas!: Canvas;
  context!: GPUCanvasContext;
  device!: GPUDevice;
  textureInfo!: TextureInfo;

  setupCanvas(parentSelector = defaultCanvasParentSelector) {
    if (this.canvas) return this.canvas;
    this.canvas = setupCanvas(parentSelector);
    this.context = this.canvas.context as GPUCanvasContext;
    return this.canvas;
  }

  resetCanvas(alphaMode: GPUCanvasAlphaMode) {
    this.canvas.reset();
    this.context = this.canvas.context as GPUCanvasContext;
    this.configureCanvas(alphaMode);
  }

  async setupDevice() {
    if (this.device) return this.device;
    this.device = await setupDevice(this.context);
    return this.device;
  }

  getTextureInfo() {
    if (this.textureInfo) return this.textureInfo;
    this.textureInfo = textureInfo(this.canvas, this.device);
    return this.textureInfo;
  }

  getFormat() {
    return this.getTextureInfo().getFormat();
  }

  getDepthTextureFormat() {
    return this.getTextureInfo().getDepthTextureFormat();
  }

  getCurrentTexture() {
    return this.getTextureInfo().getDepthTextureFormat();
  }

  configureCanvas(alphaMode: GPUCanvasAlphaMode = "premultiplied") {
    this.context.configure({
      device: this.device,
      format: this.getFormat(),
      alphaMode: alphaMode,
    });
  }

  formatShader(code: Shaders) {
    return new Shader(this.device).format(code);
  }

  onCanvasResize() {
    this.canvas.resize();
    this.textureInfo.resetDepthTexture();
  }

  setupRendering(options: SetupPipelineArguments) {
    return new Pipeline({
      gpuApp: this,
      shaders: options.shaders,
      backgroundColor: options.backgroundColor || defaultBackgroundColor,
      buffers: options.buffers,
    });
  }
}

export const gpuApp = async (options: { parentSelector?: string } = {}) => {
  const gpuApp = new GpuApp();

  gpuApp.setupCanvas(options.parentSelector || defaultCanvasParentSelector);
  await gpuApp.setupDevice();
  gpuApp.configureCanvas();
  window.addEventListener("resize", () => gpuApp.onCanvasResize());

  return gpuApp;
};
