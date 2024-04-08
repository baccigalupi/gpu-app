import { Canvas } from "./canvas";

export class TextureInfo {
  device: GPUDevice;
  canvas: Canvas;
  context: GPUCanvasContext;

  format!: GPUTextureFormat;
  depthTextureFormat!: GPUTexture | null;

  constructor(canvas: Canvas, device: GPUDevice) {
    this.device = device;
    this.canvas = canvas;
    this.context = canvas.context;
  }

  getFormat() {
    if (this.format) return this.format;
    this.format = navigator.gpu.getPreferredCanvasFormat();
    return this.format;
  }

  getCurrentTexture() {
    // memoizing this leads to pipelines errors, unlike depthTextureFormat which
    // will cause memory crashes if it is recalculated in the animation loop!
    return this.context.getCurrentTexture();
  }

  getDepthTextureFormat() {
    // NOTE: this has to be memoized to avoid memory overrun. It also needs to
    // be reset when resizing the canvas.
    if (this.depthTextureFormat) return this.depthTextureFormat;

    const { height, width } = this.canvas.getAdjustedDimensions();

    this.depthTextureFormat = this.device.createTexture({
      size: [width, height],
      format: "depth24plus",
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });

    return this.depthTextureFormat;
  }

  resetDepthTexture() {
    // NOTE: when the canvas changes, we need a hook to create a new depth
    // texture since it can't be created in the frame loop
    this.depthTextureFormat = null;
    this.getDepthTextureFormat();
  }
}

export const textureInfo = (canvas: Canvas, device: GPUDevice) => {
  return new TextureInfo(canvas, device);
};
