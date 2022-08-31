import { DomainError } from './domain-error'

export class Result<T = void> {
  protected constructor(
    private readonly value: T,
    private readonly error?: DomainError,
  ) {}

  public isFailure(): this is Failure {
    return this.value instanceof Error
  }

  public getError(): DomainError {
    if (!this.isFailure()) {
      throw new Error('Result is success')
    }

    return this.error as DomainError
  }

  public getOrThrow(): T {
    if (this.isFailure()) {
      throw this.getError()
    }
    return this.value
  }

  public static ok<T = void>(value?: T): Success<T> {
    return new Success<T>(value as T)
  }
  public static fail(error: DomainError): Failure {
    return new Failure(error)
  }
}

export class Failure extends Result<never> {
  public constructor(error: DomainError) {
    super(undefined as never, error)
  }
}

export class Success<T> extends Result<T> {
  public constructor(value: T) {
    super(value)
  }
}
