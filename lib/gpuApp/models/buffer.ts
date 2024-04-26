export type BufferData = Float32Array | Float64Array | Uint32Array;

export type BindGroupEntry = {
  binding: number;
  resource: { buffer: GPUBuffer };
};

export interface BufferBindGroupDescriptor {
  descriptor: (index: number) => BindGroupEntry | null;
}

export class BufferBase {
  data: BufferData;
  device: GPUDevice;
  _deviceBuffer!: GPUBuffer;
  offset: number;
  usage!: GPUBufferUsageFlags;
  label!: string;

  constructor(data: BufferData, device: GPUDevice) {
    this.data = data;
    this.device = device;
    this.offset = 0;
  }

  get deviceBuffer() {
    if (this._deviceBuffer) return this._deviceBuffer;

    this._deviceBuffer = this.device.createBuffer({
      size: this.data.length * this.data.byteLength,
      usage: this.usage,
      label: this.label,
    });

    return this._deviceBuffer;
  }

  write() {
    this.device.queue.writeBuffer(
      this.deviceBuffer,
      this.offset,
      this.data.buffer,
    );
  }
}

export type Buffer = BufferBase & BufferBindGroupDescriptor;
export type BufferClass = new (data: BufferData, device: GPUDevice) => Buffer;
