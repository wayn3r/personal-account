import { DomainError } from './domain-error'

type ArrayOfResultValues<T> = {
  [P in keyof T]: T[P] extends Result<infer Type> ? Type : unknown
}

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

  public map<U>(mapper: (value: T) => U): Result<U> {
    if (this.isFailure()) return this

    return Result.ok(mapper(this.getOrThrow()))
  }

  public flatMap<U>(mapper: (value: T) => Result<U>): Result<U> {
    if (this.isFailure()) return this

    return mapper(this.getOrThrow())
  }

  public static combine<T extends Result<any>[]>(
    ...results: [...T]
  ): Result<ArrayOfResultValues<T>> {
    const values = []
    for (const result of results) {
      if (result.isFailure()) return result
      values.push(result.getOrThrow())
    }

    return Result.ok(values as ArrayOfResultValues<T>)
  }

  public validate(
    predicate: (value: T) => boolean,
    error: (value: T) => Failure,
  ): Result<T> {
    if (this.isFailure()) return this

    return predicate(this.getOrThrow()) ? this : error(this.getOrThrow())
  }

  public onSuccess(callback: (value: T) => void): Result<T> {
    if (!this.isFailure()) {
      callback(this.getOrThrow())
    }

    return this
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
