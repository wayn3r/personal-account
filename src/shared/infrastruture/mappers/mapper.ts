export abstract class Mapper<From, To> {
  abstract map(from: From): To

  abstract toDocument(from: To): From

  public mapList(from: From[]): To[] {
    return from.map((t) => this.map(t))
  }

  public toDocumentList(from: To[]): From[] {
    return from.map((t) => this.toDocument(t))
  }
}
