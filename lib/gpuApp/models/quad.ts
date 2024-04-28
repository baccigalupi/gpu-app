import { vec4 } from "webgpu-matrix";
import type { Model } from "../model";
import type { Point, Dimension } from "./point";
import type { Buffer } from "./buffer";
import { Vertex } from "./buffers/vertex";
import { Index } from "./buffers/index";

const ELEMENTS_IN_POINT = 4;

export class Quad implements Model {
  indexData: Uint32Array;
  vertexData: Float32Array;
  length: number;
  numberOfPoints: number;
  private _buffers!: Buffer[];

  constructor(points: Point[]) {
    this.numberOfPoints = 4;
    this.length = this.numberOfPoints * ELEMENTS_IN_POINT;
    this.indexData = new Uint32Array([0, 1, 2, 2, 3, 0]);
    this.vertexData = this.buildVertexData(points);
  }

  static create(p1: Point, p2: Point, p3: Point, p4: Point) {
    return new Quad([p1, p2, p3, p4]);
  }

  buildVertexData(points: Point[]) {
    const data = new Float32Array(this.length);

    points.forEach((point: Point, pointIndex: number) => {
      point
        .toVector()
        .forEach((dataElement: number, coordinateIndex: number) => {
          data[this.indexFor(pointIndex, coordinateIndex)] = dataElement;
        });
    });

    return data;
  }

  get p1x() {
    const index = this.indexFor(0, 0);
    return this.vertexData[index];
  }
  get p1y() {
    const index = this.indexFor(0, 1);
    return this.vertexData[index];
  }
  get p1z() {
    const index = this.indexFor(0, 2);
    return this.vertexData[index];
  }
  get p2x() {
    const index = this.indexFor(1, 0);
    return this.vertexData[index];
  }
  get p2y() {
    const index = this.indexFor(1, 1);
    return this.vertexData[index];
  }
  get p2z() {
    const index = this.indexFor(1, 2);
    return this.vertexData[index];
  }
  get p3x() {
    const index = this.indexFor(2, 0);
    return this.vertexData[index];
  }
  get p3y() {
    const index = this.indexFor(2, 1);
    return this.vertexData[index];
  }
  get p3z() {
    const index = this.indexFor(2, 2);
    return this.vertexData[index];
  }
  get p4x() {
    const index = this.indexFor(3, 0);
    return this.vertexData[index];
  }
  get p4y() {
    const index = this.indexFor(3, 1);
    return this.vertexData[index];
  }
  get p4z() {
    const index = this.indexFor(3, 2);
    return this.vertexData[index];
  }

  set p1x(value: number) {
    this.updateData(0, 0, value);
  }
  set p2x(value: number) {
    this.updateData(1, 0, value);
  }
  set p3x(value: number) {
    this.updateData(2, 0, value);
  }
  set p4x(value: number) {
    this.updateData(3, 0, value);
  }
  set p1y(value: number) {
    this.updateData(0, 1, value);
  }
  set p2y(value: number) {
    this.updateData(1, 1, value);
  }
  set p3y(value: number) {
    this.updateData(2, 1, value);
  }
  set p4y(value: number) {
    this.updateData(3, 1, value);
  }
  set p1z(value: number) {
    this.updateData(0, 2, value);
  }
  set p2z(value: number) {
    this.updateData(1, 2, value);
  }
  set p3z(value: number) {
    this.updateData(2, 2, value);
  }
  set p4z(value: number) {
    this.updateData(3, 2, value);
  }

  get x() {
    return this.vector(0);
  }
  get y() {
    return this.vector(1);
  }
  get z() {
    return this.vector(2);
  }

  set x(values: Float32Array) {
    this.setVector(0, values);
  }
  set y(values: Float32Array) {
    this.setVector(1, values);
  }
  set z(values: Float32Array) {
    this.setVector(2, values);
  }

  vector(startingIndex: number) {
    const vector = new Float32Array(this.numberOfPoints);
    const vertexIndices = this.indices(startingIndex);
    vertexIndices.forEach((vertexIndex, vectorIndex) => {
      vector[vectorIndex] = this.vertexData[vertexIndex];
    });
    return vector;
  }

  setVector(startingIndex: number, value: Float32Array) {
    const vertexIndices = this.indices(startingIndex);
    vertexIndices.forEach((vertexIndex, valueIndex) => {
      this.vertexData[vertexIndex] = value[valueIndex];
    });
  }

  indices(startingIndex: number) {
    const indices = [];
    for (
      let index = startingIndex;
      index < this.length;
      index += ELEMENTS_IN_POINT
    ) {
      indices.push(index);
    }
    return indices;
  }

  translate(dimension: Dimension) {
    const { x, y, z } = dimension;
    if (x !== 0) {
      this.x = vec4.add(this.x, [x, x, x, x]) as Float32Array;
    }
    if (y !== 0) {
      this.y = vec4.add(this.y, [y, y, y, y]) as Float32Array;
    }
    if (z !== 0) {
      this.z = vec4.add(this.z, [z, z, z, z]) as Float32Array;
    }
  }

  // rotate, scale

  // TODO: other buffers when needed?
  buffers(device: GPUDevice) {
    if (this._buffers) return this._buffers;

    this._buffers = [
      new Vertex(this.vertexData, device),
      new Index(this.indexData, device),
    ];

    return this._buffers;
  }

  updateData(pointIndex: number, coordinateIndex: number, value: number) {
    this.vertexData[this.indexFor(pointIndex, coordinateIndex)] = value;
  }

  indexFor(pointIndex: number, coordinateIndex: number) {
    return pointIndex * ELEMENTS_IN_POINT + coordinateIndex;
  }
}

export const quad = (p1: Point, p2: Point, p3: Point, p4: Point) =>
  Quad.create(p1, p2, p3, p4);
