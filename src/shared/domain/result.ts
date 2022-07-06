export class Result<Success = void> {
  private constructor(
    public readonly isSuccess: boolean,
    private readonly value: Error | Success,
  ) {}

  public get isFailure() {
    return !this.isSuccess
  }

  public getError(): Error {
    if (this.isSuccess) {
      throw new Error('Result is success')
    }
    return this.value as Error
  }

  public getValue(): Success {
    if (this.isFailure) {
      throw new Error('Result is failure')
    }
    return this.value as Success
  }

  public getOrThrow(): Success {
    if (this.isFailure) {
      throw this.getError()
    }
    return this.value as Success
  }

  public static ok<Success>(value?: Success): Result<Success> {
    return new this<Success>(true, value)
  }
  public static fail(value: Error): Result<never> {
    return new this<never>(false, value)
  }
}
