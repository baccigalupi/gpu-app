import { BufferBase, BufferData, BufferBindGroupDescriptor } from "../buffer";

export class Index extends BufferBase implements BufferBindGroupDescriptor {
  constructor(data: BufferData, device: GPUDevice) {
    super(data, device);
    this.usage = GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST;
    this.label = "index";
  }

  descriptor(index: number) {
    return { binding: index, resource: { buffer: this.deviceBuffer } };
  }
}
