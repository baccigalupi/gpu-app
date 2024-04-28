import { BufferBase, BufferData, BufferBindGroupDescriptor } from "../buffer";

export class Uniform extends BufferBase implements BufferBindGroupDescriptor {
  constructor(data: BufferData, device: GPUDevice) {
    super(data, device);
    this.usage = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST;
    this.label = "uniform";
  }

  descriptor(index: number) {
    return { binding: index, resource: { buffer: this.deviceBuffer } };
  }
}
