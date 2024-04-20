export type Model = {
  gpuBuffer: () => GPUBuffer;
  writeToGpu: () => void;
  bindGroupEntry: (index: number) => {
    binding: number;
    resource: { buffer: GPUBuffer };
  };
};
