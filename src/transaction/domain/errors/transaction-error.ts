import { BadRequest, DomainError } from 'shared/domain'

export const enum TransactionError {
  INVALID_TRANSACTION = 'INVALID_TRANSACTION',
  TRANSACTION_NOT_FOUND = 'TRANSACTION_NOT_FOUND',
  TRANSACTION_ALREADY_EXISTS = 'TRANSACTION_ALREADY_EXISTS',

  INVALID_TAG = 'INVALID_TAG',
  TAG_NOT_FOUND = 'TAG_NOT_FOUND',
  TAG_ALREADY_EXISTS = 'TAG_ALREADY_EXISTS',
}

export class TransactionNameEmpty extends BadRequest {
  constructor() {
    super(DomainError.of('TRANSACTION_NAME_EMPTY'), 'Transaction name is empty')
  }
}
export class TransactionNameInvalid extends BadRequest {
  constructor(name: string) {
    super(
      DomainError.of('TRANSACTION_NAME_INVALID'),
      `Transaction name "${name}" is invalid`,
    )
  }
}
export class TransactionNameTooShort extends BadRequest {
  constructor(name: string) {
    super(
      DomainError.of('TRANSACTION_NAME_TOO_SHORT'),
      `Transaction name "${name}" is too short`,
    )
  }
}
export class TransactionNameTooLong extends BadRequest {
  constructor(name: string) {
    super(
      DomainError.of('TRANSACTION_NAME_TOO_LONG'),
      `Transaction name "${name}" is too long`,
    )
  }
}
