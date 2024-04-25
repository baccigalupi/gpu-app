import type { GpuApp } from "./facade";
import type { Renderer } from "./renderer";
import type { Shaders } from "./shader";
import { pipelineDescriptor } from "./pipelineDescriptor";
import { BindGroupEntry, Model } from "./models/modelType";

export type BlendMode = "translucent" | "default";

export class RenderPipeline {
  gpuApp: GpuApp;
  renderer: Renderer;
  device: GPUDevice;
  shaders: Shaders;
  vertexCount: number;
  models: any[];
  blendMode: BlendMode;

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
    this.blendMode = "default";
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
    return pipelineDescriptor(
      this.gpuApp,
      this.shaders,
      this.blendMode,
    ).build();
  }

  addPipeline() {
    this.passEncoder.setPipeline(this.pipeline);
  }

  // TODO: currently only sets one bind group
  setupBindGroups() {
    if (!this.models.length) return;

    this.models.forEach((model) => model.writeToGpu());

    const entries = this.models.reduce((collection, model: Model) => {
      const index = collection.length;
      return collection.concat(model.bindGroupEntries(index));
    }, [] as BindGroupEntry[]);


    const bindGroup = this.device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: entries,
    });

    this.passEncoder.setBindGroup(0, bindGroup);
  }

  blend(blendMode: BlendMode) {
    this.blendMode = blendMode;
  }

  // TODO: vertex count should be dynamically generated so that we can look at
  // the models and vertex data to determine what the vertex count should be.
  // Overwrite still needed for the example and easier cases of rendering static
  // stuff via the shaders.
  draw() {
    this.passEncoder.draw(this.vertexCount);
  }
}
