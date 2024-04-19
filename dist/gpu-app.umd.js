(function (s, n) {
  typeof exports == "object" && typeof module < "u"
    ? n(exports)
    : typeof define == "function" && define.amd
      ? define(["exports"], n)
      : ((s = typeof globalThis < "u" ? globalThis : s || self),
        n((s["gpu-app"] = {})));
})(this, function (s) {
  "use strict";
  var j = Object.defineProperty;
  var B = (s, n, a) =>
    n in s
      ? j(s, n, { enumerable: !0, configurable: !0, writable: !0, value: a })
      : (s[n] = a);
  var t = (s, n, a) => (B(s, typeof n != "symbol" ? n + "" : n, a), a);
  class n {
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
      const { height: e, width: i } = this.element.getBoundingClientRect();
      return (this.width = i), (this.height = e), { height: e, width: i };
    }
    getAdjustedDimensions() {
      return { width: this.adjustedWidth(), height: this.adjustedHeight() };
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
  const a = (r = "#app") => {
    const e = new n(r);
    return e.addElementToDom(), e.getContext(), e;
  };
  class u {
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
        i = e && (await e.requestDevice());
      return i || this.raiseNotCapable(), (this.device = i), i;
    }
    raiseNotCapable() {
      throw new Error("GPU not available");
    }
  }
  const d = async (r) => {
      const e = new u(r);
      return await e.getDevice(), e.device;
    },
    C = "depth24plus";
  class b {
    constructor(e, i) {
      t(this, "device");
      t(this, "canvas");
      t(this, "context");
      t(this, "format");
      t(this, "depthTextureFormat");
      (this.device = i), (this.canvas = e), (this.context = e.context);
    }
    getFormat() {
      return this.format
        ? this.format
        : ((this.format = navigator.gpu.getPreferredCanvasFormat()),
          this.format);
    }
    getCurrentTexture() {
      return this.context.getCurrentTexture();
    }
    getDepthTextureFormat(e = C) {
      if (this.depthTextureFormat) return this.depthTextureFormat;
      const { height: i, width: h } = this.canvas.getAdjustedDimensions();
      return (
        (this.depthTextureFormat = this.device.createTexture({
          size: [h, i],
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
  const w = (r, e) => new b(r, e);
  class p {
    constructor(e) {
      t(this, "device");
      this.device = e;
    }
    format(e) {
      typeof e == "string" && (e = [e]);
      const i = e.join(`

`);
      return this.device.createShaderModule({ code: i });
    }
  }
  const c = "depth24plus",
    E = { depthCompare: "less", format: c },
    y = { vertex: "vertex_entry", fragment: "fragment_entry" };
  class D {
    constructor(e, i) {
      t(this, "gpuApp");
      t(this, "depthTesting");
      t(this, "depthTestingOptions");
      t(this, "entryOptions");
      t(this, "buffers");
      t(this, "shaders");
      (this.gpuApp = e),
        (this.depthTesting = !1),
        (this.depthTestingOptions = E),
        (this.entryOptions = y),
        (this.buffers = []),
        (this.shaders = i);
    }
    build() {
      const e = this.gpuApp.formatShader(this.shaders);
      return {
        vertex: this.buildVertex(e),
        fragment: this.buildFragment(e),
        layout: "auto",
        ...this.buildDepthTesting(),
        primitive: { topology: "triangle-list" },
      };
    }
    setDepthTesting(e = {}) {
      return (
        (this.depthTesting = !0),
        (this.depthTestingOptions = { ...this.depthTestingOptions, ...e }),
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
              format: this.depthTestingOptions.format || c,
              ...this.depthTestingOptions,
            },
          }
        : {};
    }
  }
  const A = (r, e) => new D(r, e);
  class l {
    constructor(e, i, h) {
      t(this, "gpuApp");
      t(this, "renderer");
      t(this, "device");
      t(this, "shaders");
      t(this, "vertexCount");
      t(this, "models");
      t(this, "pipeline");
      t(this, "passEncoder");
      (this.renderer = i),
        (this.gpuApp = e),
        (this.device = e.device),
        (this.shaders = h),
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
      return A(this.gpuApp, this.shaders).build();
    }
    addPipeline() {
      this.passEncoder.setPipeline(this.pipeline);
    }
    setupBindGroups() {
      if (!this.models.length) return;
      const e = this.models[0];
      e.writeToGpu();
      const i = this.device.createBindGroup({
        layout: this.pipeline.getBindGroupLayout(0),
        entries: [{ binding: 0, resource: { buffer: e.buffer() } }],
      });
      this.passEncoder.setBindGroup(0, i);
    }
    draw() {
      this.passEncoder.draw(this.vertexCount);
    }
  }
  const P = (r) => {};
  class g {
    constructor(e = P) {
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
  class F {
    constructor(e) {
      t(this, "gpuApp");
      this.gpuApp = e;
    }
    background(e) {
      return {
        view: this.gpuApp.getCurrentTexture().createView(),
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
  const O = (r) => new F(r),
    o = (r) => {},
    S = { r: 0.1172, g: 0.1602, b: 0.2304, a: 1 };
  class m {
    constructor(e) {
      t(this, "gpuApp");
      t(this, "frame");
      t(this, "renderPipelines");
      t(this, "device");
      t(this, "queue");
      t(this, "backgroundColor");
      t(this, "commandEncoder");
      t(this, "passEncoder");
      (this.gpuApp = e), (this.frame = new g()), (this.renderPipelines = []);
    }
    setup() {
      (this.device = this.gpuApp.device),
        (this.queue = this.gpuApp.device.queue);
    }
    renderLoop(e = o) {
      requestAnimationFrame(() => {
        this.render(e), this.renderLoop(e);
      });
    }
    render(e = o) {
      this.update(e),
        this.createFrameResources(),
        this.renderPipelines.forEach((i) => {
          i.run();
        }),
        this.finishFrame();
    }
    addPipeline(e) {
      const i = new l(this.gpuApp, this, e.shaders);
      return e.models && (i.models = e.models), this.renderPipelines.push(i), i;
    }
    setBackgroundColor(e) {
      this.backgroundColor = e;
    }
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
      const i = O(this.gpuApp).background(this.backgroundColor || S);
      return (
        (i.view = this.gpuApp.context.getCurrentTexture().createView()),
        this.commandEncoder.beginRenderPass({ colorAttachments: [i] })
      );
    }
  }
  const f = "#app";
  class v {
    constructor() {
      t(this, "renderer");
      t(this, "canvas");
      t(this, "context");
      t(this, "device");
      t(this, "textureInfo");
      this.renderer = new m(this);
    }
    async setupDevice() {
      return this.device
        ? this.device
        : ((this.device = await d(this.context)),
          this.renderer.setup(),
          this.device);
    }
    getTextureInfo() {
      return this.textureInfo
        ? this.textureInfo
        : ((this.textureInfo = w(this.canvas, this.device)), this.textureInfo);
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
    setupCanvas(e = f) {
      return this.canvas
        ? this.canvas
        : ((this.canvas = a(e)),
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
      return new p(this.device).format(e);
    }
    setBackgroundColor(e) {
      this.renderer.setBackgroundColor(e);
    }
    setupRendering(e, i) {
      return this.renderer.addPipeline({ shaders: e, models: i });
    }
    render(e = o) {
      this.renderer.renderLoop(e);
    }
  }
  const x = async (r = {}) => {
      const e = new v();
      return (
        e.setupCanvas(r.parentSelector || f),
        await e.setupDevice(),
        e.configureCanvas(),
        window.addEventListener("resize", () => e.onCanvasResize()),
        e
      );
    },
    T = (r) => {
      const { a: e } = r;
      return { r: r.r * e, g: r.g * e, b: r.b * e, a: e };
    },
    R = Object.freeze(
      Object.defineProperty(
        {
          __proto__: null,
          colorDictToArray: (r, e = null) => {
            const i = e || r.a;
            return [r.r, r.g, r.b, i];
          },
          normalizeColor: (r, e) => (e === "opaque" ? r : T(r)),
          premultiply: T,
        },
        Symbol.toStringTag,
        { value: "Module" },
      ),
    ),
    I = {
      premultiply: `fn premultiply(color: vec4f) -> vec4f {
  return vec4f(color.rgb * color.a, color.a);
}`,
    };
  (s.Canvas = n),
    (s.FrameInfo = g),
    (s.GpuApp = v),
    (s.RenderPipeline = l),
    (s.Renderer = m),
    (s.SetupDevice = u),
    (s.Shader = p),
    (s.color = R),
    (s.default = x),
    (s.gpuApp = x),
    (s.setupCanvas = a),
    (s.setupDevice = d),
    (s.shaders = I),
    Object.defineProperties(s, {
      __esModule: { value: !0 },
      [Symbol.toStringTag]: { value: "Module" },
    });
});
