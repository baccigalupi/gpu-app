import { Points } from "./point";
import { PolygonStorage } from "./polygonStorage";
import { PolyParser } from "./polyParser";

export class Subgon {
  points!: Points;
  length!: number;
  indices!: number[];
  storage: PolygonStorage;

  constructor(storage: PolygonStorage) {
    this.storage = storage;
  }

  static fromStorage(storage: PolygonStorage, parser: PolyParser) {
    const poly = new Subgon(storage);
    poly.extractDataFromParser(parser);
    return poly;
  }

  extractDataFromParser(parser: PolyParser) {
    this.points = parser.points;
    this.length = this.points.length;
    this.indices = parser.indices;
  }
}
