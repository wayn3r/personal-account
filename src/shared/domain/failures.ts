import { DomainError } from './domain-error'
import { Failure } from './result'

export class BadRequest extends Failure {
  public constructor(domainError: DomainError, public readonly message = 'Bad request') {
    super(domainError)
  }
}
