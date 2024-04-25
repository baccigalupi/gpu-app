export type BindGroupEntry = {
  binding: number;
  resource: { buffer: GPUBuffer };
};

export type Model = {
  gpuBuffer: () => GPUBuffer;
  writeToGpu: () => void;
  bindGroupEntry: (index: number) => BindGroupEntry;
};
