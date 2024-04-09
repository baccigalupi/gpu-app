export type Shaders = string | string[];
export class Shader {
  device: GPUDevice;

  constructor(device: GPUDevice) {
    this.device = device;
  }

  format(shaders: Shaders) {
    if (typeof shaders === "string") {
      shaders = [shaders];
    }

    const code = shaders.join("\n\n");

    return this.device.createShaderModule({ code });
  }
}
