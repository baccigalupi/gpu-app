import { Vec4 } from "../matrixTypes";

export class AsUniform {
  data: Vec4;
  device: GPUDevice;
  offset: number;

  _gpuBuffer!: GPUBuffer;

  constructor(data: Vec4, device: GPUDevice) {
    this.data = data;
    this.device = device;
    this.offset = 0;
  }

  setOffset(offset: number) {
    this.offset = offset;
  }

  gpuBuffer() {
    if (this._gpuBuffer) return this._gpuBuffer;

    this._gpuBuffer = this.device.createBuffer({
      size: this.data.length * this.data.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    return this._gpuBuffer;
  }

  writeToGpu() {
    this.device.queue.writeBuffer(
      this.gpuBuffer(),
      this.offset,
      this.data.buffer,
    );
  }

  bindGroupEntries(startingIndex: number) {
    return [
      { binding: startingIndex, resource: { buffer: this.gpuBuffer() } }
    ];
  }
}
