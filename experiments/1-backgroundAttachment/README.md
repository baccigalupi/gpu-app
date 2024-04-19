# Experiment 1: Background attachment and transparency

Transparency is very, very unintuitive in the WebGPU API!

When you are using the WebGPU API one of the first things you need to do is
configure the canvas context. In GpuApp, you can set the canvas' alpha mode via
initialization arguments:

```typescript
const app = new gpuApp({ alphaMode: "opaque" });
```

There are two options for this [alphaMode value](https://developer.mozilla.org/en-US/docs/Web/API/GPUCanvasContext/configure#alphamode): `premultiplied` and `opaque`;

The default `alphaModd` for GpuApp is "premultiplied" which is a really
confusing that the WebGPU makes your canvas translucent. In the experiments
I set the css for the canvas background to be a checker board patter on gray and
white.

## Premultiply explained

So what's confusing about the `premultiplied` setting? It expects you the
developer to apply the opacity value to each of the red, green, and blue values.
By apply, I mean you reduce the value of the original red, greed and blue values
by multiplying. That's why it's called `premultiplied`; you the developer
multiply those values before you pass the `GPUColor` to the gpu for render.

The thing that is unintuitive about this pre-multiplication is that in the web
we use colors where the alpha channel is independent and controls the
transparency of the color defined by the red, green and blue values. However, in
the GPU, the expectation is that the highest value that the red, green and blue
values can have is the alpha value.

Premultiplying in typescript looks like this:

```typescript
const premultiply = (color: GPUColorDict) => {
  const { a } = color;
  return {
    r: color.r * a,
    g: color.g * a,
    b: color.b * a,
    a,
  };
};
```

In the wgsl shader language, it looks like this:

```wgsl
fn premultiply(color: vec4f) -> vec4f {
  return vec4f(color.rgb * color.a, color.a);
}
```

GpuApp allows you to combine multiple shaders together, so you won't need to
recreated this in you app. Just import it.

## Hello simple background

The simplest experiment, rendering a background, still requires a lot of work.

It's easier with GpuApp:

```typescript
import { GpuApp, color } from "gpuApp";
import shader from "./path/to/shader.wgsl?raw";

const { premultiply } = color;

const app = await gpuApp({ parentSelector: "#canvas-container" });
const backgroundColor = premuliply({ r: 0.95, g: 0.25, b: 0.25, a: 0.5 });

app.setBackgroundColor(backgroundColor);
app.setupRendering(shader);
app.render();
```

This is an experiment about rendering a background via attachment
operations and also the differences between `premultiplied` and `opaque`.

### Premuliply attachment, without premuliplying the value

Let's change that background color to not be weirdly premultiplied:

```typescript
const backgroundColor = { r: 0.95, g: 0.25, b: 0.25, a: 0.5 };
```

![alpha value of 0.95](/src/experiments/backgroundAttachment/images/non-premultiplied-095.png)

For higher alpha values everything seems fine! Above is a value of 0.95 for the
alpha.

![alpha value of 0.50](/src/experiments/backgroundAttachment/images/non-premultiplied-050.png)

The wrongness of the transparency overlay is more apparent when we drop the
alpha value down to 0.50. Although there is a checkerboard, there are no gray
values mixed in. This is a cotton candy landscape.

Below you can see the very odd transition from 0.01 alpha to 0.00.

![alpha value of 0.01](/src/experiments/backgroundAttachment/images/non-premultiplied-001.png)

Alpha 0.01.

![alpha value of 0.00](/src/experiments/backgroundAttachment/images/non-premultiplied-000.png)

Alpha 0.00.

It's like the gpu is going along with a very wrong monochromatic checkerboard,
and doesn't realize until it's fully transparent that it is doing the wrong
thing.

### Premuliply attachment, actually premuliplyed

Here are those same alpha values with the premultiply function applied on the
js side of the house:

```typescript
const backgroundColor = premuliply({ r: 0.95, g: 0.25, b: 0.25, a: 0.5 });
```

![color premultiplied with alhpa 0.95](/src/experiments/backgroundAttachment/images/premultiplied-095.png)

Alpha is 0.95. You can see more gray mixing into the color that previously.

![color premultiplied with alhpa 0.50](/src/experiments/backgroundAttachment/images/premultiplied-050.png)

Alpha is 0.50. The actual transparency mixed with the background is pretty easy
to see here.

![color premultiplied with alhpa 0.01](/src/experiments/backgroundAttachment/images/premultiplied-001.png)

Alpha is 0.01. It looks almost identical to the 0 alpha value below, which is
expected.

![color premultiplied with alhpa 0.00](/src/experiments/backgroundAttachment/images/premultiplied-000.png)

Alpha is 0.00, and this is the same as what happens when the value is not
premultiplied.

### Why do premultiplied colors act this way?

It turns out that the non-premultiplied values passed as the background are
not legal values. Instead of throwing an error, which the webgpu does at the
slightest wiff of an issue, it just makes this weird color mess up.

### What about `opaque`?

Opaque does what you would expect. There is no transparency to the underlying
checkerboard.

But what happens if you premultiply the background anyway?

```typescript
const app = await gpuApp({
  parentSelector: "#canvas-container",
  alphaMode: "opaque",
});

const backgroundColor = premuliply({ r: 0.95, g: 0.25, b: 0.25, a: 0.5 });
```

This one is a bit easier to understand. The canvas is supposed to be opaque, and
so it ignores the alpha value entirely. What's left behind is the red, green and
blue values that have been reduced by the opacity value anyway. That means the
color is edging towards black by the alpha value.

![color premultiplied with opaque configuration](/src/experiments/backgroundAttachment/images/opaque-premultiplied-050.png)

Alpha value is 0.5, which results in a color that is equivalent to:

```typescript
{ r: 0.475, g: 0.125, b: 0.125 }
```

### Other notes

Although we are passing in shaders, for the above examples we don't use the
shader at all. Passing a shader with a vertex entry point is required by the
WebGPU API, so we do.

We get a nifty warning in the console saying:

```
Calling [RenderPassEncoder].Draw with a vertex count of 0 is unusual.
```

It is unusual, but we are experimenting. In general if you don't pass along
data to the pipeline, it assumes a vertex count of 0. Then you will see this
warning.

## Hello changing background

The WebGPU and this GpuApp library are made for animation, and the GpuApp
provides you with a callback in order to update data going into the gpu:

```typescript
import { GpuApp, color } from "gpuApp";
import shader from "./path/to/shader.wgsl?raw";

const backgroundChanger = () => {
  // generates a color that slowly shifts
};

const app = await gpuApp({ parentSelector: "#canvas-container" });

app.setBackgroundColor(backgroundChanger());
app.setupRendering(shader);
app.render(() => backgroundChanger());
```

If you are looking for an example of a class that changes the color slowly,
check out [/src/experiments/shared/colorShifter.ts](ColorShifter).

## Hello transparency fail

Most WebGPU tutorials start with rendering a triangle via a shader statically.
Probably this is because a triangle is the primitive most often used for
rendering in the GPU, and because sending data to the GPU is very, very
complicated.

Now that we have a background that is doing transparency in a way that makes
some sense, let's go ahead and render a transparent triangle via the shader.

```wgsl
@vertex
fn vertex_entry(@builtin(vertex_index) index : u32) -> @builtin(position) vec4f {
  var pos = array<vec2f, 3>(
    vec2(0.0, 0.5),
    vec2(-0.5, -0.5),
    vec2(0.5, -0.5)
  );

  return vec4f(pos[index], 0.0, 1.0);
}

@fragment
fn fragment_entry() -> @location(0) vec4f {
  return premultiply(vec4f(0.25, 0.95, 0.25, 0.5));
}
```

The GPU coordinate system for x and y range from -1 to 1. So the triangle we are
defining in the `@vertex` `vertex_entry` function is roughly in the center of
the screen.

The `premuliply` function in wgsl is the one shown at the top of this doc in the
description of alpha modes. We can pass both shaders via passing an array to
the GpuApp.

```typescript
import premultiplyShader from "../shaders/premultiply.wgsl?raw";
import triangleShader from "./staticTriangle.wgsl?raw";

const shaders = [premultiplyShader, triangleShader];
gpuApp.setBackgroundColor(backgroundColor);
const pipeline = gpuApp.setupRendering(shaders);
pipeline.overrideVertexCount(3);
gpuApp.render();
```

Since we are rendering via the wsgl shader, we have to explicitly tell the
pipeline how many vertices we expect. In the case of a triangle, and our code,
that is three.
