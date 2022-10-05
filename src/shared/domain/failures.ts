import { DomainError } from './domain-error'
import { Failure } from './result'

export class BadRequest extends Failure {
  public constructor(domainError: DomainError, public readonly message = 'Bad request') {
    super(domainError)
  }
}

export class NotFound extends Failure {
  public constructor(domainError: DomainError, public readonly message = 'Not found') {
    super(domainError)
  }
}
export class Conflict extends Failure {
  public constructor(domainError: DomainError, public readonly message = 'Conflict') {
    super(domainError)
  }
}
