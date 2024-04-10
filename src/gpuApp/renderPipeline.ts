import type { GpuApp } from "../gpuApp";
import type { Shaders } from "../gpuApp/shader";
import { passEncoderOperations } from "./passEncoderOperations";
import { PipelineDescriptor, pipelineDescriptor } from "./pipelineDescriptor";

export type SetupRenderPipelineArguments = {
  gpuApp: GpuApp;
  shaders: Shaders;
  backgroundColor?: GPUColorDict;
};

export type PipelineOnUpdate = (pipeline: RenderPipeline) => void
const nullUpdater = (_pipeline: RenderPipeline) => {}

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

  renderLoop(onUpdate: PipelineOnUpdate) {
    requestAnimationFrame(() => {
      this.render(onUpdate);
      this.renderLoop(onUpdate);
    });
  }

  render(onUpdate: PipelineOnUpdate = nullUpdater) {
    onUpdate(this);

    this.createCommandEncoder();
    this.createPipeline();
    this.createPassEncoder();

    this.passEncoder.draw(0);
    this.passEncoder.end();

    this.queue.submit([this.commandEncoder.finish()]);
  }

  setupRenderFramework() {
    this.depthTexture = this.gpuApp.getDepthTextureFormat();
    this.pipelineDescriptor = pipelineDescriptor(this.gpuApp, this.shaders);
  }

  setupEncoder() {
    const operations = passEncoderOperations(this.gpuApp);
    const background = operations.background(this.backgroundColor);
    background.view = this.gpuApp.context.getCurrentTexture().createView()

    return this.commandEncoder.beginRenderPass({
      colorAttachments: [
        background
      ]
    });
  }

  createCommandEncoder() {
    this.commandEncoder = this.device.createCommandEncoder();
  }

  createPipeline() {
    const descriptor = this.pipelineDescriptor.build();
    this.pipeline = this.device.createRenderPipeline(descriptor);
  }

  createPassEncoder() {
    this.passEncoder = this.setupEncoder();
    this.passEncoder.setPipeline(this.pipeline);
  }
}

export const setupRenderPipeline = (options: SetupRenderPipelineArguments) => {
  return new RenderPipeline(options);
};
