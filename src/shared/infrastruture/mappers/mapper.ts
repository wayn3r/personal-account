export abstract class Mapper<From, To> {
  abstract map(from: From): To

  public mapList(from: From[]): To[] {
    return from.map((t) => this.map(t))
  }
}
