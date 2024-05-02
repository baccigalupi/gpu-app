export const toTriangles = (indices: number[]) => {
  if (indices.length <= 3) return indices;

  const [anchor, p1, p2, ...rest] = indices;
  const triangleIndices = [anchor, p1, p2];
  let previous = p2;

  rest.forEach((current) => {
    triangleIndices.push(previous);
    triangleIndices.push(current);
    triangleIndices.push(anchor);

    previous = current;
  });

  return triangleIndices;
};
