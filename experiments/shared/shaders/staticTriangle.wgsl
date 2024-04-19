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
