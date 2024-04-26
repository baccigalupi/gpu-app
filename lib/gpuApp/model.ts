import { Buffer } from "./models/buffer";

export type Model = {
  buffers: (device: GPUDevice) => Buffer[];
};
