import type { GpuApp } from "../gpuApp";
import type { Shaders } from "../gpuApp/shader";
import { helloHardCoded } from "../views/helloHardCoded";
import { passEncoderOperations } from "./passEncoderOperations";
import { PipelineDescriptor, pipelineDescriptor } from "./pipelineDescriptor";

export type SetupRenderPipelineArguments = {
  gpuApp: GpuApp;
  shaders: Shaders;
  backgroundColor?: GPUColorDict;
};

const defaultBackgroundColor = {
  r: 0.5,
  g: 0.5,
  b: 0.5,
  a: 1.0,
};

class RenderPipeline {
  gpuApp: GpuApp;
  device: GPUDevice;
  queue: GPUQueue;
  shaders: Shaders;
  backgroundColor: GPUColorDict;
  // set once per class
  pipelineDescriptor!: PipelineDescriptor;
  commandEncoder!: GPUCommandEncoder;
  depthTexture!: GPUTexture;

  // set once per run
  pipeline!: GPURenderPipeline;
  passEncoder!: GPURenderPassEncoder;

  constructor(options: SetupRenderPipelineArguments) {
    this.gpuApp = options.gpuApp;
    this.device = options.gpuApp.device;
    this.shaders = options.shaders;
    this.backgroundColor = options.backgroundColor || defaultBackgroundColor;
    this.queue = this.gpuApp.device.queue;
    this.setupRenderFramework();
  }

  renderLoop() {
    this.render();

    requestAnimationFrame(() => {
      // this.update();
      this.render();
    });
  }

  render() {
    this.createPipeline();
    this.createPassEncoder();

    this.passEncoder.draw(3);
    this.passEncoder.end();

    this.queue.submit([this.commandEncoder.finish()]);
  }

  setupRenderFramework() {
    this.commandEncoder = this.device.createCommandEncoder();
    this.depthTexture = this.gpuApp.getDepthTextureFormat();
    this.pipelineDescriptor = pipelineDescriptor(this.gpuApp, this.shaders);
  }

  setupEncoder(backgroundColor: GPUColorDict) {
    const operations = passEncoderOperations(this.gpuApp);
    const background = operations.background(backgroundColor);
    background.view = this.gpuApp.context.getCurrentTexture().createView()

    return this.commandEncoder.beginRenderPass({
      colorAttachments: [
        background
      ]
    });
  }

  createPipeline() {
    const descriptor = this.pipelineDescriptor.build();
    this.pipeline = this.device.createRenderPipeline(descriptor);
  }

  createPassEncoder() {
    this.passEncoder = this.setupEncoder(this.backgroundColor);
    this.passEncoder.setPipeline(this.pipeline);
  }
}

export const setupRenderPipeline = (options: SetupRenderPipelineArguments) => {
  return new RenderPipeline(options);
};
