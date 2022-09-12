import { DomainEvent } from './domain-event'

export abstract class AggregateRoot {
  private events: DomainEvent[] = []

  public getEvents(): DomainEvent[] {
    const events = this.events
    this.events = []
    return events
  }

  protected addEvent(event: DomainEvent): void {
    this.events.push(event)
  }
}
