import type { GpuApp } from "../gpuApp";
import type { Shaders } from "./shader";
import { OnFrameUpdate, Frame } from "./frame";
import { passEncoderOperations } from "./passEncoderOperations";
import { PipelineDescriptor, pipelineDescriptor } from "./pipelineDescriptor";

export type RendererArguments = {
  gpuApp: GpuApp;
  shaders: Shaders;
  backgroundColor?: GPUColorDict;
  buffers?: any[];
};

export type SetupRendererArguments = {
  shaders: Shaders;
  backgroundColor?: GPUColorDict;
  buffers?: any[];
};

export type RendererOnUpdate = (renderer: Renderer) => void;
const nullUpdater = (_renderer: Renderer) => {};

const defaultBackgroundColor = {
  r: 0.5,
  g: 0.5,
  b: 0.5,
  a: 1.0,
};

export class Renderer {
  gpuApp: GpuApp;
  device: GPUDevice;
  queue: GPUQueue;
  shaders: Shaders;
  backgroundColor: GPUColorDict;
  buffers: any[];
  vertexCount: number;
  frame: Frame;

  pipelineDescriptor: PipelineDescriptor;

  // set once per frame
  commandEncoder!: GPUCommandEncoder;
  pipeline!: GPURenderPipeline;
  passEncoder!: GPURenderPassEncoder;

  constructor(options: RendererArguments) {
    this.gpuApp = options.gpuApp;
    this.device = options.gpuApp.device;
    this.queue = this.gpuApp.device.queue;
    this.frame = new Frame();

    this.shaders = options.shaders;
    this.backgroundColor = options.backgroundColor || defaultBackgroundColor;

    this.buffers = options.buffers || [];
    this.vertexCount = this.buffers.length;
    this.pipelineDescriptor = this.setupDescriptor();
  }

  renderLoop(onUpdate: RendererOnUpdate = nullUpdater) {
    requestAnimationFrame(() => {
      this.render(onUpdate);
      this.renderLoop(onUpdate);
    });
  }

  render(onUpdate: RendererOnUpdate = nullUpdater) {
    this.update(onUpdate);

    this.createFrameResources();

    this.setupBindGroups();

    this.passEncoder.draw(this.vertexCount);
    this.passEncoder.end();

    this.queue.submit([this.commandEncoder.finish()]);
  }

  overrideVertexCount(count: number) {
    this.vertexCount = count;
  }

  // -- private, maybe different class

  update(onUpdate: RendererOnUpdate) {
    this.frame.update();
    onUpdate(this);
    // this.buffers.update(); // pass delta time?
  }

  createFrameResources() {
    this.createCommandEncoder();
    this.createPipeline();
    this.createPassEncoder();
  }

  setupBindGroups() {
    if (!this.buffers.length) return;

    const uniform = this.buffers[0];
    uniform.writeToGpu();
    const uniformsBindGroup = this.device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: uniform.buffer() } }],
    });

    this.passEncoder.setBindGroup(0, uniformsBindGroup);
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

  setupEncoder() {
    const operations = passEncoderOperations(this.gpuApp);

    const background = operations.background(this.backgroundColor);
    background.view = this.gpuApp.context.getCurrentTexture().createView();

    return this.commandEncoder.beginRenderPass({
      colorAttachments: [background],
    });
  }

  setupDescriptor() {
    return pipelineDescriptor(this.gpuApp, this.shaders);
  }
}
