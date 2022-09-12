export abstract class DomainEvent {
  public abstract readonly name: string
  public abstract readonly occurredAt: Date
}
