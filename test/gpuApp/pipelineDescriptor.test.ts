import { describe, it, expect, vi, beforeEach } from "vitest";

import { pipelineDescriptor } from "../../src/gpuApp/pipelineDescriptor";
import { GpuApp } from "../../src/gpuApp";

describe("getPipelineDescriptor", () => {
  const shaders = ["code1", "code2", "code3"];
  const gpuApp = new GpuApp();

  beforeEach(() => {
    vi.spyOn(gpuApp, "formatShader").mockImplementation(
      (code) => `compiled code`,
    );
    vi.spyOn(gpuApp, "getFormat").mockImplementation(() => "textureFormat");
  });

  it("compiles shaders into the vertex and fragment section", () => {
    const builder = pipelineDescriptor(gpuApp);
    const descriptor = builder.build(shaders);

    expect(descriptor.vertex.module).toEqual("compiled code");
    expect(descriptor.fragment.module).toEqual("compiled code");
  });

  describe("vertex", () => {
    it("by default it includes an empty buffer description and the default entry point", () => {
      const builder = pipelineDescriptor(gpuApp);
      const descriptor = builder.build(shaders);

      expect(descriptor.vertex.buffers).toEqual([]);
      expect(descriptor.vertex.entryPoint).toEqual("vertex_entry");
    });

    it("when configured differently, it uses the configured entry point", () => {
      const builder = pipelineDescriptor(gpuApp);
      builder.setEntry({ vertex: "main" });

      const descriptor = builder.build(shaders);

      expect(descriptor.vertex.entryPoint).toEqual("main");
    });

    it.skip("when configured with a buffer descriptor, includes it", () => {
      const builder = pipelineDescriptor(gpuApp);
      // builder.addBuffer();
    });
  });

  describe("fragment", () => {
    it("by default includes the default entry point", () => {
      const builder = pipelineDescriptor(gpuApp);
      const descriptor = builder.build(shaders);

      expect(descriptor.fragment.entryPoint).toEqual("fragment_entry");
    });

    it("when configured differently, it uses the configured entry point", () => {
      const builder = pipelineDescriptor(gpuApp);
      builder.setEntry({ fragment: "fragment_main" });

      const descriptor = builder.build(shaders);

      expect(descriptor.fragment.entryPoint).toEqual("fragment_main");
    });

    it("gets the target from the gpuApp", () => {
      vi.spyOn(gpuApp, "getFormat").mockImplementation(
        () => "canvas textureFormat",
      );

      const builder = pipelineDescriptor(gpuApp);
      const descriptor = builder.build(shaders);

      expect(descriptor.fragment.targets).toEqual([
        { format: "canvas textureFormat" },
      ]);
    });
  });

  describe("depth testing", () => {
    it("when not configured, there is no stencil attachment", () => {
      const builder = pipelineDescriptor(gpuApp);
      const descriptor = builder.build(shaders);

      expect(descriptor.depthStencil).toEqual(undefined);
    });

    it("when turned on, adds default depth testing values", () => {
      const builder = pipelineDescriptor(gpuApp);
      builder.setDepthTesting();
      const descriptor = builder.build(shaders);

      expect(descriptor.depthStencil).toEqual({
        depthCompare: "less",
        depthWriteEnabled: true,
        format: "depth24plus",
      });
    });

    it("can take and use other stencil options", () => {
      const builder = pipelineDescriptor(gpuApp);
      builder.setDepthTesting({
        depthCompare: "greater-equal",
        depthBias: 3,
      });
      const descriptor = builder.build(shaders);

      expect(descriptor.depthStencil.depthCompare).toEqual("greater-equal");
      expect(descriptor.depthStencil.depthBias).toEqual(3);
    });
  });
});
