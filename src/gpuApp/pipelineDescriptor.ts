import type { GpuApp } from "../gpuApp";
import type { Shaders } from "./shader";

export type EntryOptions = {
  vertex?: string;
  fragment?: string;
};

export type DescriptorBuildOptions = {
  backgroundColor?: GPUColor;
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

  constructor(gpuApp: GpuApp) {
    this.gpuApp = gpuApp;
    this.depthTesting = false;
    this.depthTestingOptions = defaultDepthTestingOptions;
    this.entryOptions = defaultEntryOptions;
    this.buffers = [] as GPUVertexBufferLayout[];
  }

  build(shaders: Shaders): GPURenderPipelineDescriptor {
    const shaderModule = this.gpuApp.formatShader(shaders);

    return {
      vertex: this.buildVertex(shaderModule),
      fragment: this.buildFragment(shaderModule),
      layout: "auto",
      ...this.buildDepthTesting(),
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
      targets: [{ format: this.gpuApp.getFormat() }],
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

export const pipelineDescriptor = (gpuApp: GpuApp) => {
  return new PipelineDescriptor(gpuApp);
};

export const getPipelineDescriptor = (
  gpuApp: GpuApp,
  shader: string,
): GPURenderPipelineDescriptor => {
  return {
    vertex: {
      module: gpuApp.formatShader(shader),
      entryPoint: "vertex_entry",
      buffers: [],
    },
    fragment: {
      module: gpuApp.formatShader(shader),
      entryPoint: "fragment_entry",
      targets: [{ format: gpuApp.getFormat() }],
    },
    primitive: {
      topology: "triangle-list",
      // cullMode: 'back',
    },
    layout: "auto",
  };
};
