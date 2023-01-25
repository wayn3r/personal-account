export abstract class DomainEvent {
  public abstract readonly eventName: string
  private _occurredAt: Date

  constructor() {
    this._occurredAt = new Date()
  }

  public get occurredAt(): Date {
    return new Date(this._occurredAt)
  }
}
