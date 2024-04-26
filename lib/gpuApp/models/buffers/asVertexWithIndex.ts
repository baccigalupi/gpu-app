const VEREX_USAGE = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST;
const INDEX_USAGE = GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST;

export class AsVertexWithIndex {
  points: Float32Array;
  indexes: Uint32Array;
  device: GPUDevice;
  offset: number;
  gpuBuffers: GPUBuffer[];
  buffersSet: boolean;

  constructor(points: Float32Array, indexes: Uint32Array, device: GPUDevice) {
    this.points = points;
    this.indexes = indexes;
    this.device = device;
    this.offset = 0;
    this.gpuBuffers = [] as GPUBuffer[];
    this.buffersSet = false;
  }

  setOffset(offset: number) {
    this.offset = offset;
  }

  buffers() {
    if (this.buffersSet) return this.gpuBuffers;

    this.buffersSet = true;

    const vertexBuffer = this.device.createBuffer({
      size: this.points.length * this.points.byteLength,
      usage: VEREX_USAGE,
      label: "vertex",
    });

    const indexBuffer = this.device.createBuffer({
      size: this.indexes.length * this.indexes.byteLength,
      usage: INDEX_USAGE,
      label: "index"
    });

    this.gpuBuffers = [
      vertexBuffer,
      indexBuffer
    ];

    return this.gpuBuffers
  }

  writeToGpu() {
    this.buffers().forEach((buffer: GPUBuffer) => {
      const data = this.getData(buffer.usage);

      this.device.queue.writeBuffer(
        buffer,
        this.offset,
        data.buffer,
      );
    });
  }

  getData(usage: GPUBufferUsageFlags) {
    if (usage === VEREX_USAGE) {
      return this.points;
    } else {
      return this.indexes;
    }
  }

  bindGroupEntries(startingIndex: number) {
    const buffers = this.buffers();

    return [
      { binding: startingIndex, resource: { buffer: buffers[0]} },
      { binding: startingIndex + 1, resource: { buffer: buffers[1] }},
    ]
  }
}
