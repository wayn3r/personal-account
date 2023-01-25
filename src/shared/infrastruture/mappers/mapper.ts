export abstract class Mapper<From, To> {
  abstract map(from: From): To

  abstract reverseMap(from: To): From

  public mapList(from: From[]): To[] {
    return from.map((t) => this.map(t))
  }

  public reverseMapList(from: To[]): From[] {
    return from.map((t) => this.reverseMap(t))
  }
}
