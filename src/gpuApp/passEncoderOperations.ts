import { GpuApp } from "../gpuApp";

export class PassEncoderOperations {
  gpuApp: GpuApp;

  constructor(gpuApp: GpuApp) {
    this.gpuApp = gpuApp;
  }

  background(backgroundColor: GPUColorDict): GPURenderPassColorAttachment {
    return {
      view: this.gpuApp.getCurrentTexture().createView(), // This doesn't work??
      clearValue: backgroundColor,
      loadOp: "clear",
      storeOp: "store",
    };
  }

  depthTesting(): GPURenderPassDepthStencilAttachment {
    return {
      view: this.gpuApp.getDepthTextureFormat().createView(),
      depthClearValue: 1.0,
      depthLoadOp: "clear",
      depthStoreOp: "store",
    };
  }
}

export const passEncoderOperations = (gpuApp: GpuApp) => {
  return new PassEncoderOperations(gpuApp);
};
