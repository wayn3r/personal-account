export class Tag {
  public readonly id: string
  public readonly name: string
  public readonly active: boolean

  public constructor(params: { id: string; name: string; active: boolean }) {
    this.id = params.id
    this.name = params.name
    this.active = params.active
  }
}
