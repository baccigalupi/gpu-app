import { GpuApp } from "../gpuApp";
import { passEncoderOperations } from "./passEncoderOperations";
import { getPipelineDescriptor } from "./pipelineDescriptor";

class RenderPipeline {
  gpuApp: GpuApp;
  device: GPUDevice;
  queue: GPUQueue;
  commandEncoder: GPUCommandEncoder;
  depthTexture: GPUTexture;

  pipeline!: GPURenderPipeline;

  constructor(gpuApp: GpuApp) {
    this.gpuApp = gpuApp;
    this.device = gpuApp.device;
    this.queue = gpuApp.device.queue;
    this.commandEncoder = this.device.createCommandEncoder();
    this.depthTexture = this.gpuApp.getDepthTextureFormat();
  }

  renderLoop(shader: string, backgroundColor: GPUColor) {
    this.run(shader, backgroundColor);
    requestAnimationFrame(() => {
      this.run(shader, backgroundColor);
    });
  }

  run(shader: string, backgroundColor: GPUColor) {
    const pipelineDescriptor = getPipelineDescriptor(this.gpuApp, shader);
    this.pipeline = this.device.createRenderPipeline(pipelineDescriptor);

    const passEncoder = this.setupEncoder(backgroundColor);

    passEncoder.setPipeline(this.pipeline);
    passEncoder.draw(3);
    passEncoder.end();

    this.queue.submit([this.commandEncoder.finish()]);
  }

  setupEncoder(backgroundColor: GPUColor) {
    const operations = passEncoderOperations(this.gpuApp);

    return this.commandEncoder.beginRenderPass({
      colorAttachments: [operations.background(backgroundColor)],
      // depthStencilAttachment: operations.depthTesting(),
    });
  }
}

export const setupRenderPipeline = (gpuApp: GpuApp) =>
  new RenderPipeline(gpuApp);
