# Example 1: Background Attachment

## Hello simple background

Most WebGPU tutorials start with a "hello world" that has you setup a triangle's
worth of data in the wgsl shader, then This tutorial starts a bit lower level.
We are just going to set the background.

With the GpuApp framework, this gets really simple:

```typescript
import type { GpuApp } from "../../gpuApp";
import shaders from "./staticTriangle.wgsl?raw";

export const renderBackgroundOnlyStatic = (gpuApp: GpuApp) => {
  const pipeline = gpuApp.setupRendering({
    shaders,
    backgroundColor: { r: 0.5, g: 0.5, b: 0.5, a: 1.0 },
  });
  pipeline.renderLoop();
};
```

In `main.ts` we create the gpuApp and then pass it to the render function to
get going.

```typescript
import { GpuApp } from "./gpuApp";
import { render } from "./wherever/you/have/your/render/function";

const gpu = await gpuApp();
render(gpuApp);
```

Experiment with changing the alpha values. 

## Hello changing background

In the example at `/examples/backgroundAttachment/index.ts`, I've also included
some UI for calculating the framerate. So it looks more cluttered, but this is 
the condensed deal.

Next let's introduce a little class that changes a color by a small amount each
time it is called. In each frame of the animation, we will update the color and
set it to the background attachment. That should make an background that slowly
changes through random colors.

```typescript
export const renderBackgroundOnly = (gpuApp: GpuApp) => {
  const colorShifter = new ColorShifter();
  const pipeline = gpuApp.setupRendering({
    shaders,
    backgroundColor: colorShifter.color,
  });

  pipeline.renderLoop(() => {
    pipeline.backgroundColor = colorShifter.update();
  });
};
```

`renderLoop` takes an update function that you can use to change stuff between
frames.

Running works as expected!

You may notice a warning in console that says:

```
Calling [RenderPassEncoder].Draw with a vertex count of 0 is unusual.
```

It is unusual! The real goal of the web gpu is to receive data from JavaScript
and process it in the shaders.

For the moment, we are completely ignoring the shader even though it is passed
in.

## Hello triangle on background

Most WebGPU tutorials start with creating triangle data in the shader. Creating
your data in the shader is also unusual, and for me a bit confusing. It's hard
to track why the vertex shader gets called without vertext data, and the 
magical data found via `builtin` make matters worse. But that's what we are
going to try next with a 

The
reason that triangles are popular in tutorials is because triangles are the most
common primative 