import type { GpuApp } from "./facade";
import { BlendMode } from "./renderPipeline";
import type { Shaders } from "./shader";

export type EntryOptions = {
  vertex?: string;
  fragment?: string;
};

export type DescriptorBuildOptions = {
  backgroundColor?: GPUColorDict;
};

export type DepthTestingOptions = {
  depthBias?: number;
  depthBiasClamp?: number;
  depthBiasSlopeScale?: number;
  depthCompare?: GPUCompareFunction;
  format?: GPUTextureFormat;
  stencilBack?: GPUStencilFaceState;
  stencilFront?: GPUStencilFaceState;
  stencilReadMask?: number;
  stencilWriteMask?: number;
};

const defaultDepthFormat = "depth24plus";

const defaultDepthTestingOptions: GPUDepthStencilState = {
  depthCompare: "less",
  format: defaultDepthFormat,
};

const defaultEntryOptions: EntryOptions = {
  vertex: "vertex_entry",
  fragment: "fragment_entry",
};

export class PipelineDescriptor {
  gpuApp: GpuApp;
  depthTesting: boolean;
  depthTestingOptions: DepthTestingOptions;
  entryOptions: EntryOptions;
  buffers: GPUVertexBufferLayout[];
  shaders: Shaders;
  blendMode: BlendMode;

  constructor(
    gpuApp: GpuApp,
    shaders: Shaders,
    blendMode: BlendMode = "default",
  ) {
    this.gpuApp = gpuApp;
    this.depthTesting = false;
    this.depthTestingOptions = defaultDepthTestingOptions;
    this.entryOptions = defaultEntryOptions;
    this.buffers = [] as GPUVertexBufferLayout[];
    this.shaders = shaders;
    this.blendMode = blendMode;
  }

  build(): GPURenderPipelineDescriptor {
    const shaderModule = this.gpuApp.formatShader(this.shaders);

    return {
      vertex: this.buildVertex(shaderModule),
      fragment: this.buildFragment(shaderModule),
      layout: "auto",
      ...this.buildDepthTesting(),
      primitive: {
        topology: "triangle-list",
      },
    };
  }

  setDepthTesting(options: DepthTestingOptions = {}) {
    this.depthTesting = true;

    this.depthTestingOptions = {
      ...this.depthTestingOptions,
      ...options,
    };

    return this;
  }

  setEntry(options: EntryOptions) {
    if (options.vertex) {
      this.entryOptions.vertex = options.vertex;
    }

    if (options.fragment) {
      this.entryOptions.fragment = options.fragment;
    }

    return this;
  }

  buildVertex(module: GPUShaderModule) {
    return {
      module,
      entryPoint: this.entryOptions.vertex,
      buffers: this.buffers,
    };
  }

  buildFragment(module: GPUShaderModule) {
    return {
      module,
      entryPoint: this.entryOptions.fragment,
      targets: [
        {
          format: this.gpuApp.getFormat(),
          ...this.blendDescriptor(),
        },
      ],
    };
  }

  blendDescriptor() {
    if (this.blendMode === "default") return {};

    // translucent
    return {
      blend: {
        color: {
          operation: "add",
          srcFactor: "src-alpha",
          dstFactor: "one-minus-src-alpha",
        },
        alpha: {
          operation: "add",
          srcFactor: "zero",
          dstFactor: "one",
        },
      },
    };
  }

  buildDepthTesting() {
    if (!this.depthTesting) return {};

    return {
      depthStencil: {
        depthWriteEnabled: true,
        format: this.depthTestingOptions.format || defaultDepthFormat,
        ...this.depthTestingOptions,
      },
    };
  }
}

export const pipelineDescriptor = (
  gpuApp: GpuApp,
  shaders: Shaders,
  blendMode: BlendMode = "default",
) => {
  return new PipelineDescriptor(gpuApp, shaders, blendMode);
};
