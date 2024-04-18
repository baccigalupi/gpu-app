import type { GpuApp } from "./facade";
import { RenderPipeline } from "./renderPipeline";
import type { Shaders } from "./shader";
import { FrameInfo } from "./frameInfo";
import { passEncoderOperations } from "./passEncoderOperations";

export type RendererOnUpdate = (renderer: Renderer) => void;
export const nullRenderUpdater = (_renderer: Renderer) => {};

export type AddPipelineOptions = {
  shaders: Shaders;
  models?: any[];
};

export const defaultBackgroundColor = {
  r: 0.1172,
  g: 0.1602,
  b: 0.2304,
  a: 1.0,
};

export class Renderer {
  gpuApp: GpuApp;
  frame: FrameInfo;
  renderPipelines: RenderPipeline[];

  device!: GPUDevice;
  queue!: GPUQueue;
  backgroundColor!: GPUColorDict;

  // set once per frame
  commandEncoder!: GPUCommandEncoder;
  passEncoder!: GPURenderPassEncoder;

  constructor(gpuApp: GpuApp) {
    this.gpuApp = gpuApp;
    this.frame = new FrameInfo();
    this.renderPipelines = [] as RenderPipeline[];
  }

  setup() {
    this.device = this.gpuApp.device;
    this.queue = this.gpuApp.device.queue;
  }

  renderLoop(onUpdate: RendererOnUpdate = nullRenderUpdater) {
    requestAnimationFrame(() => {
      this.render(onUpdate);
      this.renderLoop(onUpdate);
    });
  }

  render(onUpdate: RendererOnUpdate = nullRenderUpdater) {
    this.update(onUpdate);
    this.createFrameResources();

    this.renderPipelines.forEach((renderPipeline) => {
      renderPipeline.run();
    });

    this.finishFrame();
  }

  addPipeline(options: AddPipelineOptions) {
    const pipeline = new RenderPipeline(this.gpuApp, this, options.shaders);
    if (options.models) pipeline.models = options.models;
    this.renderPipelines.push(pipeline);
    return pipeline;
  }

  setBackgroundColor(color: GPUColorDict) {
    this.backgroundColor = color;
  }

  /// ---- private

  update(onUpdate: RendererOnUpdate) {
    this.frame.update();
    // this.renderPipelines.forEach((pipeline) => pipeline.update(this.frame.deltaTime));
    onUpdate(this);
  }

  createFrameResources() {
    this.createCommandEncoder();
    this.createPassEncoder();
  }

  finishFrame() {
    this.passEncoder.end();
    this.queue.submit([this.commandEncoder.finish()]);
  }

  createCommandEncoder() {
    this.commandEncoder = this.device.createCommandEncoder();
  }

  createPassEncoder() {
    this.passEncoder = this.setupEncoder();
  }

  setupEncoder() {
    const operations = passEncoderOperations(this.gpuApp);

    const background = operations.background(
      this.backgroundColor || defaultBackgroundColor,
    );
    background.view = this.gpuApp.context.getCurrentTexture().createView();

    return this.commandEncoder.beginRenderPass({
      colorAttachments: [background],
    });
  }
}
