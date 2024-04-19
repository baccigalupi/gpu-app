import { describe, it, expect, vi, beforeEach } from "vitest";

import { Shader } from "../../lib/gpuApp/shader";

describe("Shader, format", () => {
  const device = {
    createShaderModule: ({ code }) => `${code} compiled`,
  };

  it("compiles one shader snippet without error", () => {
    const shaders = "code";

    const module = new Shader(device).format(shaders);

    expect(module).toEqual("code compiled");
  });

  it("compiles multiple shader snippets without error", () => {
    const shaders = ["code1", "code2", "code3"];
    const module = new Shader(device).format(shaders);

    expect(module).toEqual("code1\n\ncode2\n\ncode3 compiled");
  });
});
