var u = Object.defineProperty;
var d = (r, e, s) =>
  e in r
    ? u(r, e, { enumerable: !0, configurable: !0, writable: !0, value: s })
    : (r[e] = s);
var t = (r, e, s) => (d(r, typeof e != "symbol" ? e + "" : e, s), s);
class p {
  constructor(e) {
    t(this, "parentSelector");
    t(this, "width");
    t(this, "height");
    t(this, "element");
    t(this, "context");
    (this.parentSelector = e), (this.width = 1e3), (this.height = 800);
  }
  setup() {
    this.addElementToDom(), this.getContext();
  }
  getParent() {
    return document.querySelector(this.parentSelector);
  }
  addElementToDom() {
    const e = this.getParent();
    e
      ? ((this.element = document.createElement("canvas")),
        e.appendChild(this.element),
        this.resize())
      : console.error("canvas not created");
  }
  getDimensions() {
    const { height: e, width: s } = this.element.getBoundingClientRect();
    return (this.width = s), (this.height = e), { height: e, width: s };
  }
  getAdjustedDimensions() {
    return {
      width: this.adjustedWidth(),
      height: this.adjustedHeight(),
    };
  }
  aspect() {
    return this.width / this.height;
  }
  adjustedWidth() {
    return this.width * window.devicePixelRatio;
  }
  adjustedHeight() {
    return this.height * window.devicePixelRatio;
  }
  resize() {
    this.getDimensions(),
      (this.element.width = this.adjustedWidth()),
      (this.element.height = this.adjustedHeight());
  }
  getContext() {
    if (this.context) return this.context;
    if (this.element)
      return (this.context = this.element.getContext("webgpu")), this.context;
  }
  reset() {
    (this.context = null), this.element.remove(), this.setup();
  }
}
const c = (r = "#app") => {
  const e = new p(r);
  return e.addElementToDom(), e.getContext(), e;
};
class l {
  constructor(e) {
    t(this, "context");
    t(this, "gpuCapable");
    t(this, "adapter");
    t(this, "device");
    t(this, "format");
    (this.context = e), (this.gpuCapable = !!navigator.gpu);
  }
  async getAdapter() {
    return this.adapter
      ? this.adapter
      : (this.gpuCapable || this.raiseNotCapable(),
        (this.adapter = await navigator.gpu.requestAdapter()),
        this.adapter);
  }
  async getDevice() {
    if (this.device) return this.device;
    this.gpuCapable || this.raiseNotCapable();
    const e = await this.getAdapter(),
      s = e && (await e.requestDevice());
    return s || this.raiseNotCapable(), (this.device = s), s;
  }
  raiseNotCapable() {
    throw new Error("GPU not available");
  }
}
const g = async (r) => {
    const e = new l(r);
    return await e.getDevice(), e.device;
  },
  m = "depth24plus";
class f {
  constructor(e, s) {
    t(this, "device");
    t(this, "canvas");
    t(this, "context");
    t(this, "format");
    t(this, "depthTextureFormat");
    (this.device = s), (this.canvas = e), (this.context = e.context);
  }
  getFormat() {
    return this.format
      ? this.format
      : ((this.format = navigator.gpu.getPreferredCanvasFormat()), this.format);
  }
  getCurrentTexture() {
    return this.context.getCurrentTexture();
  }
  getDepthTextureFormat(e = m) {
    if (this.depthTextureFormat) return this.depthTextureFormat;
    const { height: s, width: i } = this.canvas.getAdjustedDimensions();
    return (
      (this.depthTextureFormat = this.device.createTexture({
        size: [i, s],
        format: e,
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
      })),
      this.depthTextureFormat
    );
  }
  resetDepthTexture() {
    (this.depthTextureFormat = null), this.getDepthTextureFormat();
  }
}
const v = (r, e) => new f(r, e);
class x {
  constructor(e) {
    t(this, "device");
    this.device = e;
  }
  format(e) {
    typeof e == "string" && (e = [e]);
    const s = e.join(`

`);
    return this.device.createShaderModule({ code: s });
  }
}
const a = "depth24plus",
  T = {
    depthCompare: "less",
    format: a,
  },
  C = {
    vertex: "vertex_entry",
    fragment: "fragment_entry",
  };
class b {
  constructor(e, s) {
    t(this, "gpuApp");
    t(this, "depthTesting");
    t(this, "depthTestingOptions");
    t(this, "entryOptions");
    t(this, "buffers");
    t(this, "shaders");
    (this.gpuApp = e),
      (this.depthTesting = !1),
      (this.depthTestingOptions = T),
      (this.entryOptions = C),
      (this.buffers = []),
      (this.shaders = s);
  }
  build() {
    const e = this.gpuApp.formatShader(this.shaders);
    return {
      vertex: this.buildVertex(e),
      fragment: this.buildFragment(e),
      layout: "auto",
      ...this.buildDepthTesting(),
      primitive: {
        topology: "triangle-list",
      },
    };
  }
  setDepthTesting(e = {}) {
    return (
      (this.depthTesting = !0),
      (this.depthTestingOptions = {
        ...this.depthTestingOptions,
        ...e,
      }),
      this
    );
  }
  setEntry(e) {
    return (
      e.vertex && (this.entryOptions.vertex = e.vertex),
      e.fragment && (this.entryOptions.fragment = e.fragment),
      this
    );
  }
  buildVertex(e) {
    return {
      module: e,
      entryPoint: this.entryOptions.vertex,
      buffers: this.buffers,
    };
  }
  buildFragment(e) {
    return {
      module: e,
      entryPoint: this.entryOptions.fragment,
      targets: [{ format: this.gpuApp.getFormat() }],
    };
  }
  buildDepthTesting() {
    return this.depthTesting
      ? {
          depthStencil: {
            depthWriteEnabled: !0,
            format: this.depthTestingOptions.format || a,
            ...this.depthTestingOptions,
          },
        }
      : {};
  }
}
const w = (r, e) => new b(r, e);
class E {
  constructor(e, s, i) {
    t(this, "gpuApp");
    t(this, "renderer");
    t(this, "device");
    t(this, "shaders");
    t(this, "vertexCount");
    t(this, "models");
    // Set per frame
    t(this, "pipeline");
    t(this, "passEncoder");
    (this.renderer = s),
      (this.gpuApp = e),
      (this.device = e.device),
      (this.shaders = i),
      (this.vertexCount = 0),
      (this.models = []);
  }
  overrideVertexCount(e) {
    this.vertexCount = e;
  }
  run() {
    this.getPassEncoder(),
      this.buildPipeline(),
      this.addPipeline(),
      this.setupBindGroups(),
      this.draw();
  }
  getPassEncoder() {
    this.passEncoder = this.renderer.passEncoder;
  }
  buildPipeline() {
    this.pipeline = this.device.createRenderPipeline(this.buildDescriptor());
  }
  buildDescriptor() {
    return w(this.gpuApp, this.shaders).build();
  }
  addPipeline() {
    this.passEncoder.setPipeline(this.pipeline);
  }
  // TODO: currently static and just sets the one uniform. What I am dreaming of
  // is that the models can know what bind group they should live in, based on
  // convention. Then the model can writeToGpu and also return an entry for the
  // bind group here.
  setupBindGroups() {
    if (!this.models.length) return;
    const e = this.models[0];
    e.writeToGpu();
    const s = this.device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: e.gpuBuffer() } }],
    });
    this.passEncoder.setBindGroup(0, s);
  }
  // TODO: vertex count should be dynamically generated so that we can look at
  // the models and vertex data to determine what the vertex count should be.
  // Overwrite still needed for the example and easier cases of rendering static
  // stuff via the shaders.
  draw() {
    this.passEncoder.draw(this.vertexCount);
  }
}
const D = (r) => {};
class P {
  constructor(e = D) {
    t(this, "startTime");
    t(this, "rate");
    t(this, "deltaTime");
    t(this, "onUpdate");
    (this.startTime = performance.now()),
      (this.rate = 0),
      (this.deltaTime = 1),
      (this.onUpdate = e);
  }
  update(e = performance.now()) {
    this.calculate(e), (this.startTime = e), this.onUpdate(this);
  }
  calculate(e) {
    (this.deltaTime = e - this.startTime),
      (this.rate = Math.round(3600 / this.deltaTime));
  }
}
class y {
  constructor(e) {
    t(this, "gpuApp");
    this.gpuApp = e;
  }
  background(e) {
    return {
      view: this.gpuApp.getCurrentTexture().createView(),
      // This doesn't work??
      clearValue: e,
      loadOp: "clear",
      storeOp: "store",
    };
  }
  depthTesting() {
    return {
      view: this.gpuApp.getDepthTextureFormat().createView(),
      depthClearValue: 1,
      depthLoadOp: "clear",
      depthStoreOp: "store",
    };
  }
}
const A = (r) => new y(r),
  n = (r) => {},
  F = {
    r: 0.1172,
    g: 0.1602,
    b: 0.2304,
    a: 1,
  };
class O {
  constructor(e) {
    t(this, "gpuApp");
    t(this, "frame");
    t(this, "renderPipelines");
    t(this, "device");
    t(this, "queue");
    t(this, "backgroundColor");
    // set once per frame
    t(this, "commandEncoder");
    t(this, "passEncoder");
    (this.gpuApp = e), (this.frame = new P()), (this.renderPipelines = []);
  }
  setup() {
    (this.device = this.gpuApp.device), (this.queue = this.gpuApp.device.queue);
  }
  renderLoop(e = n) {
    requestAnimationFrame(() => {
      this.render(e), this.renderLoop(e);
    });
  }
  render(e = n) {
    this.update(e),
      this.createFrameResources(),
      this.renderPipelines.forEach((s) => {
        s.run();
      }),
      this.finishFrame();
  }
  addPipeline(e) {
    const s = new E(this.gpuApp, this, e.shaders);
    return e.models && (s.models = e.models), this.renderPipelines.push(s), s;
  }
  setBackgroundColor(e) {
    this.backgroundColor = e;
  }
  /// ---- private
  update(e) {
    this.frame.update(), e(this);
  }
  createFrameResources() {
    this.createCommandEncoder(), this.createPassEncoder();
  }
  finishFrame() {
    this.passEncoder.end(), this.queue.submit([this.commandEncoder.finish()]);
  }
  createCommandEncoder() {
    this.commandEncoder = this.device.createCommandEncoder();
  }
  createPassEncoder() {
    this.passEncoder = this.setupEncoder();
  }
  setupEncoder() {
    const s = A(this.gpuApp).background(this.backgroundColor || F);
    return (
      (s.view = this.gpuApp.context.getCurrentTexture().createView()),
      this.commandEncoder.beginRenderPass({
        colorAttachments: [s],
      })
    );
  }
}
const o = "#app";
class R {
  constructor() {
    t(this, "renderer");
    t(this, "canvas");
    t(this, "context");
    t(this, "device");
    t(this, "textureInfo");
    this.renderer = new O(this);
  }
  async setupDevice() {
    return this.device
      ? this.device
      : ((this.device = await g(this.context)),
        this.renderer.setup(),
        this.device);
  }
  getTextureInfo() {
    return this.textureInfo
      ? this.textureInfo
      : ((this.textureInfo = v(this.canvas, this.device)), this.textureInfo);
  }
  getFormat() {
    return this.getTextureInfo().getFormat();
  }
  getDepthTextureFormat() {
    return this.getTextureInfo().getDepthTextureFormat();
  }
  getCurrentTexture() {
    return this.getTextureInfo().getDepthTextureFormat();
  }
  setupCanvas(e = o) {
    return this.canvas
      ? this.canvas
      : ((this.canvas = c(e)),
        (this.context = this.canvas.context),
        this.canvas);
  }
  configureCanvas(e = "premultiplied") {
    this.context.configure({
      device: this.device,
      format: this.getFormat(),
      alphaMode: e,
    });
  }
  resetCanvas(e) {
    this.canvas.reset(),
      (this.context = this.canvas.context),
      this.configureCanvas(e);
  }
  onCanvasResize() {
    this.canvas.resize(), this.textureInfo.resetDepthTexture();
  }
  formatShader(e) {
    return new x(this.device).format(e);
  }
  setBackgroundColor(e) {
    this.renderer.setBackgroundColor(e);
  }
  setupRendering(e, s) {
    return this.renderer.addPipeline({ shaders: e, models: s });
  }
  render(e = n) {
    this.renderer.renderLoop(e);
  }
}
const k = async (r = {}) => {
    const e = new R();
    return (
      e.setupCanvas(r.parentSelector || o),
      await e.setupDevice(),
      e.configureCanvas(),
      window.addEventListener("resize", () => e.onCanvasResize()),
      e
    );
  },
  h = (r) => {
    const { a: e } = r;
    return {
      r: r.r * e,
      g: r.g * e,
      b: r.b * e,
      a: e,
    };
  },
  S = (r, e) => (e === "opaque" ? r : h(r)),
  I = (r, e = null) => {
    const s = e || r.a;
    return [r.r, r.g, r.b, s];
  },
  G = /* @__PURE__ */ Object.freeze(
    /* @__PURE__ */ Object.defineProperty(
      {
        __proto__: null,
        colorDictToArray: I,
        normalizeColor: S,
        premultiply: h,
      },
      Symbol.toStringTag,
      { value: "Module" },
    ),
  ),
  B = `fn premultiply(color: vec4f) -> vec4f {
  return vec4f(color.rgb * color.a, color.a);
}`,
  q = {
    premultiply: B,
  };
export {
  p as Canvas,
  P as FrameInfo,
  R as GpuApp,
  E as RenderPipeline,
  O as Renderer,
  l as SetupDevice,
  x as Shader,
  G as color,
  k as default,
  k as gpuApp,
  c as setupCanvas,
  g as setupDevice,
  q as shaders,
};
