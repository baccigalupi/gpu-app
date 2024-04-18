import { setupCanvas, Canvas } from "./canvas";
import { setupDevice } from "./device";
import { textureInfo, TextureInfo } from "./textureInfo";
import { Shader, Shaders } from "./shader";
import {
  Renderer,
  nullRenderUpdater,
  RendererOnUpdate,
} from "./renderer";

const defaultCanvasParentSelector = "#app";

export class GpuApp {
  renderer: Renderer;
  canvas!: Canvas;
  context!: GPUCanvasContext;
  device!: GPUDevice;
  textureInfo!: TextureInfo;

  constructor() {
    this.renderer = new Renderer(this);
  }

  async setupDevice() {
    if (this.device) return this.device;
    this.device = await setupDevice(this.context);
    this.renderer.setup();
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

  setupCanvas(parentSelector = defaultCanvasParentSelector) {
    if (this.canvas) return this.canvas;
    this.canvas = setupCanvas(parentSelector);
    this.context = this.canvas.context as GPUCanvasContext;
    return this.canvas;
  }

  configureCanvas(alphaMode: GPUCanvasAlphaMode = "premultiplied") {
    this.context.configure({
      device: this.device,
      format: this.getFormat(),
      alphaMode,
    });
  }

  resetCanvas(alphaMode: GPUCanvasAlphaMode) {
    this.canvas.reset();
    this.context = this.canvas.context as GPUCanvasContext;
    this.configureCanvas(alphaMode);
  }

  onCanvasResize() {
    this.canvas.resize();
    this.textureInfo.resetDepthTexture();
  }

  formatShader(code: Shaders) {
    return new Shader(this.device).format(code);
  }

  setBackgroundColor(color: GPUColorDict) {
    this.renderer.setBackgroundColor(color);
  }

  setupRendering(shaders: Shaders, models?: any[]) {
    return this.renderer.addPipeline({ shaders, models });
  }

  render(onUpdate: RendererOnUpdate = nullRenderUpdater) {
    this.renderer.renderLoop(onUpdate);
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
