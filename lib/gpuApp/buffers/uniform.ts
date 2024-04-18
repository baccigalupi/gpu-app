import type { GpuApp } from "../facade";

type TypedArrayClass =
  | Int8ArrayConstructor
  | Uint8ArrayConstructor
  | Int16ArrayConstructor
  | Uint16ArrayConstructor
  | Int32ArrayConstructor
  | Uint32ArrayConstructor
  | Float32ArrayConstructor
  | Float64ArrayConstructor;

const defaultArrayType = Float32Array;

export class Uniform {
  data: number[];
  arrayType: TypedArrayClass;
  gpuApp: GpuApp;
  device: GPUDevice;
  label: string;
  offset: number;
  _buffer!: GPUBuffer;

  constructor(
    data: number[],
    gpuApp: GpuApp,
    options: { arrayType?: TypedArrayClass; label?: string } = {},
  ) {
    this.data = data;
    this.gpuApp = gpuApp;
    this.device = gpuApp.device;
    this.arrayType = options.arrayType || defaultArrayType;
    this.label = options.label || "uniform buffer";
    this.offset = 0;
  }

  setOffset(offset: number) {
    this.offset = offset;
  }

  buffer() {
    if (this._buffer) return this._buffer;

    this._buffer = this.device.createBuffer({
      size: this.data.length * this.arrayType.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    return this._buffer;
  }

  convertData() {
    return new this.arrayType(this.data).buffer;
  }

  writeToGpu() {
    this.device.queue.writeBuffer(
      this.buffer(),
      this.offset,
      this.convertData(),
    );
  }

  // descriptor?
}
