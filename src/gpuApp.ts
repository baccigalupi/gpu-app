import { setupCanvas, Canvas } from "./gpuApp/canvas";
import { setupDevice } from "./gpuApp/device";
import { textureInfo, TextureInfo } from "./gpuApp/textureInfo";
import { Shader, Shaders } from "./gpuApp/shader";
import { Pipeline } from "./gpuApp/pipeline";

const defaultBackgroundColor = {
  r: 0.5,
  g: 0.5,
  b: 0.5,
  a: 1.0,
};

export class GpuApp {
  canvas!: Canvas;
  context!: GPUCanvasContext;
  device!: GPUDevice;
  textureInfo!: TextureInfo;

  setupCanvas() {
    if (this.canvas) return this.canvas;
    this.canvas = setupCanvas();
    this.context = this.canvas.context;
    return this.canvas;
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

  configureCanvas() {
    this.context.configure({
      device: this.device,
      format: this.getFormat(),
      alphaMode: "premultiplied",
    });
  }

  formatShader(code: Shaders) {
    return new Shader(this.device).format(code);
  }

  onCanvasResize() {
    this.canvas.resize();
    this.textureInfo.resetDepthTexture();
  }

  setupRendering(options: {
    shaders: Shaders;
    backgroundColor: GPUColorDict | null;
  }) {
    return new Pipeline({
      gpuApp: this,
      shaders: options.shaders,
      backgroundColor: options.backgroundColor || defaultBackgroundColor,
    });
  }
}

export const gpuApp = async () => {
  const gpuApp = new GpuApp();

  gpuApp.setupCanvas();
  await gpuApp.setupDevice();
  gpuApp.configureCanvas();
  window.addEventListener("resize", () => gpuApp.onCanvasResize());

  return gpuApp;
};
