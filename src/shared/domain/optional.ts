import { Failure, Result } from './result'

export class Optional<T> {
  private constructor(private readonly value?: T) {}

  public static of<T>(value: T): Optional<NonNullable<T>> {
    return new Optional<NonNullable<T>>(value as NonNullable<T>)
  }

  public static empty<T>(): Optional<T> {
    return new Optional<T>(undefined)
  }

  isPresent(): boolean {
    return this.value !== null && this.value !== undefined
  }

  isAbsent(): boolean {
    return !this.isPresent()
  }

  public getOrThrow(): T {
    if (this.isAbsent()) {
      throw new Error('Value is empty')
    }

    return this.value as T
  }

  public orElse(defaultValue: T): T {
    return this.isPresent() ? this.getOrThrow() : defaultValue
  }

  public orElseGet(defaultValue: () => T): T {
    return this.isPresent() ? this.getOrThrow() : defaultValue()
  }

  public orElseThrow(error: Error): T {
    if (this.isAbsent()) {
      throw error
    }

    return this.getOrThrow()
  }

  public map<U>(mapper: (value: T) => U): Optional<U> {
    if (this.isAbsent()) {
      return Optional.empty<U>()
    }

    return Optional.of(mapper(this.getOrThrow()))
  }

  public getResult(): Result<T> {
    return Result.ok(this.isPresent() ? this.getOrThrow() : undefined)
  }

  public getResultOrElse(defaultValue: () => Result<T>): Result<T> {
    return this.isPresent() ? Result.ok(this.getOrThrow()) : defaultValue()
  }

  public filter(predicate: (value: T) => boolean): Optional<T> {
    if (this.isAbsent()) {
      return Optional.empty<T>()
    }

    return predicate(this.getOrThrow()) ? this : Optional.empty<T>()
  }

  public flatMap<U>(mapper: (value: T) => Optional<U>): Optional<U> {
    if (this.isAbsent()) {
      return Optional.empty<U>()
    }

    return mapper(this.getOrThrow())
  }

  public getFromObject<U extends keyof T>(key: U): Optional<T[U]> {
    if (this.isAbsent()) {
      return Optional.empty<T[U]>()
    }

    return Optional.of(this.getOrThrow()[key])
  }

  public validateIsPresent(error: () => Failure): Result<T> {
    if (this.isAbsent()) {
      return error()
    }

    return Result.ok(this.getOrThrow())
  }

  public validate(
    predicate: (value: T) => boolean,
    error: (value?: T) => Failure,
  ): Result<T> {
    if (this.isAbsent()) {
      return error()
    }

    return predicate(this.getOrThrow())
      ? Result.ok(this.getOrThrow())
      : error(this.getOrThrow())
  }

  public replaceIfEmptyWith(value: T): Optional<T> {
    return this.isPresent() ? this : Optional.of(value)
  }
}
