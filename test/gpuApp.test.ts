import { describe, it, expect, vi, beforeEach } from "vitest";

import { GpuApp } from "../src/gpuApp";

describe("GpuApp", () => {
  it("formats shader modules", () => {
    const shaders = ["code1", "code2"];
    const gpuApp = new GpuApp();
    gpuApp.device = {
      createShaderModule: ({ code }) => `${code} compiled`,
    };

    expect(gpuApp.formatShader(shaders)).toEqual("code1\n\ncode2 compiled");
  });
});
