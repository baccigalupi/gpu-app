import { BufferBase, BufferData, BufferBindGroupDescriptor } from "../buffer";

export class Vertex extends BufferBase implements BufferBindGroupDescriptor {
  constructor(data: BufferData, device: GPUDevice) {
    super(data, device);
    this.usage = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST;
    this.label = "vertex";
  }

  descriptor(_index: number) {
    return null;
  }
}
