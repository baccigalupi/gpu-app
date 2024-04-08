import { setupCanvas, Canvas } from "./app/canvas";
import { setupDevice } from "./app/device";
import { textureInfo, TextureInfo } from "./app/textureInfo";

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

  configureCanvas() {
    this.context.configure({
      device: this.device,
      format: this.getTextureInfo().getFormat(),
      alphaMode: "premultiplied",
    });
  }
}

export const app = async () => {
  const app = new GpuApp();
  app.setupCanvas();
  await app.setupDevice();
  app.configureCanvas();
};
