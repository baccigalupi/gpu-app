export class Shader {
  device: GPUDevice;

  constructor(device: GPUDevice) {
    this.device = device;
  }

  format(code: string) {
    return this.device.createShaderModule({
      code
    })
  }
}