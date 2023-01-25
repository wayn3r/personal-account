export class DomainError extends Error {
  private constructor(public readonly code: string) {
    super(code)
    this.name = 'DomainError'
  }

  static of(code: string): DomainError {
    return new DomainError(code)
  }

  toString(): string {
    return `${this.name}: ${this.code} | ${this.message}\n${this.stack}`
  }
}
