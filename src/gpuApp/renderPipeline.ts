import type { GpuApp } from '../gpuApp';
import type { Renderer } from './renderer';
import type { Shaders } from './shader';
import { pipelineDescriptor } from './pipelineDescriptor';

export class RenderPipeline {
  gpuApp: GpuApp;
  renderer: Renderer;
  device: GPUDevice;
  shaders: Shaders;
  vertexCount: number;
  models: any[];

  // Set per frame
  pipeline!: GPURenderPipeline;
  passEncoder!: GPURenderPassEncoder;

  constructor(gpuApp: GpuApp, renderer: Renderer, shaders: Shaders) {
    this.renderer = renderer;
    this.gpuApp = gpuApp;
    this.device = gpuApp.device;
    this.shaders = shaders;
    this.vertexCount = 0;
    this.models = [];
  }

  overrideVertexCount(count: number) {
    this.vertexCount = count;
  }

  run() {
    this.getPassEncoder();
    this.buildPipeline();
    this.addPipeline();
    this.setupBindGroups();
    this.draw();
  }

  getPassEncoder() {
    this.passEncoder = this.renderer.passEncoder;
  }

  buildPipeline() {
    this.pipeline = this.device.createRenderPipeline(this.buildDescriptor());
  }

  buildDescriptor() {
    return pipelineDescriptor(this.gpuApp, this.shaders).build();
  }

  addPipeline() {
    this.passEncoder.setPipeline(this.pipeline);
  }

  // TODO: currently static and just sets the one uniform. What I am dreaming of
  // is that the models can know what bind group they should live in, based on
  // convention. Then the model can writeToGpu and also return an entry for the
  // bind group here.
  setupBindGroups() {
    if (!this.models.length) return;

    const uniform = this.models[0];
    uniform.writeToGpu();
    const uniformsBindGroup = this.device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: uniform.buffer() } }],
    });

    this.passEncoder.setBindGroup(0, uniformsBindGroup);
  }

  // TODO: vertex count should be dynamically generated so that we can look at
  // the models and vertex data to determine what the vertex count should be.
  // Overwrite still needed for the example and easier cases of rendering static
  // stuff via the shaders.
  draw() {
    this.passEncoder.draw(this.vertexCount);
  }
}