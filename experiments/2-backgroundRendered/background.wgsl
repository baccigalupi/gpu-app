struct Uniforms {
  backgroundColor : vec4f,
}
@binding(0) @group(0) var<uniform> uniforms : Uniforms;

@vertex
fn vertex_entry(@builtin(vertex_index) index : u32) -> @builtin(position) vec4f {
  var position = array<vec2f, 6>(
    vec2(-1.0, 1.0),
    vec2(1.0, 1.0),
    vec2(-1.0, -1.0),

    vec2(1.0, 1.0),
    vec2(1.0, -1.0),
    vec2(-1.0, -1.0),
  );

  return vec4f(position[index], 1.0, 1.0);
}

@fragment
fn fragment_entry() -> @location(0) vec4f {
  return premultiply(uniforms.backgroundColor);
}
