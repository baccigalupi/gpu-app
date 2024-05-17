import { Points } from "./point";
import { PolygonStorage } from "./polygonStorage";
import { Subgon } from "./subgon";

export class Polygons {
  subgons: Subgon[];
  storage: PolygonStorage;
  length: number;
  calculated: boolean;
  private _vertices!: Float32Array;
  private _indices!: Int8Array;

  constructor() {
    this.subgons = [] as Subgon[];
    this.storage = new PolygonStorage();
    this.length = 0;
    this.calculated = false;
  }

  add(points: Points) {
    this.calculated = false;
    this.length += 1;
    const poly = this.storage.add(points);
    this.subgons = this.subgons.concat(Subgon.fromStorage(this.storage, poly));
  }

  at(index: number) {
    return this.subgons[index];
  }

  get vertices() {
    if (this.calculated) return this._vertices;
    this._vertices = Float32Array.from(this.storage.vertices);
    return this._vertices;
  }

  get indices() {
    if (this.calculated) return this._indices;
    this._indices = Int8Array.from(this.storage.indices);
    return this._indices;
  }
}
