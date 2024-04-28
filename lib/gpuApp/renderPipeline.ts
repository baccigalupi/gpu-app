import type { GpuApp } from "./facade";
import type { Renderer } from "./renderer";
import type { Shaders } from "./shader";
import { pipelineDescriptor } from "./pipelineDescriptor";
import { Model } from "./model";
import { Buffer, BindGroupEntry } from "./models/buffer";

export type BlendMode = "translucent" | "default";

export class RenderPipeline {
  gpuApp: GpuApp;
  renderer: Renderer;
  device: GPUDevice;
  shaders: Shaders;
  vertexCount: number;
  models: Model[];
  blendMode: BlendMode;

  // Set per frame
  pipeline!: GPURenderPipeline;
  passEncoder!: GPURenderPassEncoder;
  private _buffers!: Buffer[];

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

  get buffers() {
    if (this._buffers) return this._buffers;

    this._buffers = this.models.reduce((collection, model) => {
      return collection.concat(model.buffers(this.device));
    }, [] as Buffer[]);

    return this._buffers;
  }

  writeBuffers() {
    this.buffers.forEach((buffer: Buffer) => buffer.write());
  }

  bufferEntries() {
    return this.buffers.reduce((collection, buffer: Buffer) => {
      const index = collection.length;
      const entry = buffer.descriptor(index);
      if (entry) {
        collection = collection.concat(entry);
      }
      return collection;
    }, [] as BindGroupEntry[]);
  }

  // TODO: currently only sets one bind group
  setupBindGroups() {
    if (!this.models.length) return;

    this.writeBuffers();

    const bindGroup = this.device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: this.bufferEntries(),
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
