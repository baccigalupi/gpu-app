import type { Point } from "./point";
import type { Model } from "./modelType";
import { AsVertexWithIndex } from "./buffers/asVertexWithIndex";

const POINT_LENGTH = 4;

export class Quad implements Model {
  points: Point[];
  translation!: AsVertexWithIndex;

  constructor(points: Point[]) {
    this.points = points;
  }

  static create(p1: Point, p2: Point, p3: Point, p4: Point) {
    return new Quad([p1, p2, p3, p4]);
  }

  asVertex(device: GPUDevice) {
    const {pointsData, indexData} = this.packData();
    this.translation = new AsVertexWithIndex(pointsData, indexData, device);
  }

  packData() {
    const pointsData = new Float32Array(this.points.length * POINT_LENGTH);
    const indexData = new Uint32Array([
      0, 1, 2,
      2, 3, 0
    ]);

    this.points.forEach((point: Point, pointIndex: number) => {
      point.toVector().forEach((dataElement: number, dataIndex: number) => {
        pointsData[pointIndex + dataIndex] = dataElement;
      });
    });

    return {
      pointsData,
      indexData,
    }
  }

  writeToGpu() {
    this.translation.writeToGpu();
  }

  bindGroupEntries(index: number) {
    return this.translation.bindGroupEntries(index);
  }
}

export const quad = (p1: Point, p2: Point, p3: Point, p4: Point) => (
  Quad.create(p1, p2, p3, p4)
);
