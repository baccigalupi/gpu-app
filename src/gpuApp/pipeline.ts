import type { GpuApp } from "../gpuApp";
import type { Shaders } from "./shader";
import { OnFrameRateUpdate, FrameRateCalculator } from "./frameRate";
import { passEncoderOperations } from "./passEncoderOperations";
import { PipelineDescriptor, pipelineDescriptor } from "./pipelineDescriptor";

export type PipelineArguments = {
  gpuApp: GpuApp;
  shaders: Shaders;
  backgroundColor?: GPUColorDict;
};

export type PipelineOnUpdate = (pipeline: Pipeline) => void;
const nullUpdater = (_pipeline: Pipeline) => {};

const defaultBackgroundColor = {
  r: 0.5,
  g: 0.5,
  b: 0.5,
  a: 1.0,
};

export class Pipeline {
  gpuApp: GpuApp;
  device: GPUDevice;
  queue: GPUQueue;
  shaders: Shaders;
  backgroundColor: GPUColorDict;
  includeStats: boolean;
  vertexCount: number;

  pipelineDescriptor: PipelineDescriptor;
  depthTexture: GPUTexture;

  // set once per frame
  commandEncoder!: GPUCommandEncoder;
  pipeline!: GPURenderPipeline;
  passEncoder!: GPURenderPassEncoder;
  frameRateCalculator!: FrameRateCalculator;

  constructor(options: PipelineArguments) {
    this.gpuApp = options.gpuApp;
    this.device = options.gpuApp.device;
    this.shaders = options.shaders;
    this.backgroundColor = options.backgroundColor || defaultBackgroundColor;
    this.queue = this.gpuApp.device.queue;
    this.includeStats = false;
    this.depthTexture = this.gpuApp.getDepthTextureFormat();
    this.pipelineDescriptor = pipelineDescriptor(this.gpuApp, this.shaders);
    this.vertexCount = 0; // TODO: make it based on data
  }

  calculateStats(onUpdate: OnFrameRateUpdate) {
    this.includeStats = true;
    this.frameRateCalculator = new FrameRateCalculator(onUpdate);
  }

  renderLoop(onUpdate: PipelineOnUpdate = nullUpdater) {
    requestAnimationFrame(() => {
      this.render(onUpdate);
      this.renderLoop(onUpdate);
    });
  }

  render(onUpdate: PipelineOnUpdate = nullUpdater) {
    this.update(onUpdate);

    this.createFrameResources();

    this.passEncoder.draw(this.vertexCount);
    this.passEncoder.end();

    this.queue.submit([this.commandEncoder.finish()]);
  }

  overrideVertexCount(count: number) {
    this.vertexCount = count;
  }

  // -- private, maybe different class

  update(onUpdate: PipelineOnUpdate) {
    if (this.includeStats) this.frameRateCalculator.update();
    onUpdate(this);
  }

  createFrameResources() {
    this.createCommandEncoder();
    this.createPipeline();
    this.createPassEncoder();
  }

  setupPerAppResources() {}

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

  setupEncoder() {
    const operations = passEncoderOperations(this.gpuApp);
    const background = operations.background(this.backgroundColor);
    background.view = this.gpuApp.context.getCurrentTexture().createView();

    return this.commandEncoder.beginRenderPass({
      colorAttachments: [background],
    });
  }
}
