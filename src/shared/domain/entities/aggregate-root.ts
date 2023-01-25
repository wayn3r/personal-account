import { DomainEvent } from './domain-event'

type NonTypePropertyNames<T, ExcludedType> = {
  [K in keyof T]: T[K] extends ExcludedType ? never : K
}[keyof T]
export type Params<T> = Pick<T, NonTypePropertyNames<T, (...args: any[]) => any>>

export abstract class AggregateRoot<T> {
  protected constructor(params: Params<T>) {
    Object.keys(params).forEach((key: keyof Params<AggregateRoot<T>>) => {
      try {
        this[key] = params[key]
      } catch (error) {
        const privateKey = ('_' + key) as keyof this
        this[privateKey] = params[key]
      }
    })
  }

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
