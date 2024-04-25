export type BindGroupEntry = {
  binding: number;
  resource: { buffer: GPUBuffer };
};

export type Model = {
  writeToGpu: () => void;
  bindGroupEntries: (startingIndex: number) => BindGroupEntry[];
};
