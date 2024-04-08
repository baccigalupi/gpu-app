export class SetupDevice {
  context: GPUCanvasContext;
  gpuCapable: boolean;
  adapter!: GPUAdapter;
  device!: GPUDevice;
  format!: GPUTextureFormat;

  constructor(context: GPUCanvasContext) {
    this.context = context;
    this.gpuCapable = !!navigator.gpu;
  }

  async getAdapter() {
    if (this.adapter) return this.adapter;
    if (!this.gpuCapable) this.raiseNotCapable();

    this.adapter = (await navigator.gpu.requestAdapter()) as GPUAdapter;
    return this.adapter;
  }

  async getDevice() {
    if (this.device) return this.device;
    if (!this.gpuCapable) this.raiseNotCapable();

    const adapter = await this.getAdapter();
    const device = adapter && (await adapter.requestDevice());

    if (!device) this.raiseNotCapable();

    this.device = device as GPUDevice;
    return device;
  }

  raiseNotCapable() {
    throw new Error("GPU not available");
  }
}

export const setupDevice = async (context: GPUCanvasContext) => {
  const builder = new SetupDevice(context);
  await builder.getDevice();

  return builder.device;
};
