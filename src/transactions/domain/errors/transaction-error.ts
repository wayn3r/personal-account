import { BadRequest, Conflict, DomainError, NotFound } from '@/shared/domain/entities'

export const enum TransactionError {
  INVALID_TRANSACTION = 'INVALID_TRANSACTION',
  TRANSACTION_NOT_FOUND = 'TRANSACTION_NOT_FOUND',
  TRANSACTION_ALREADY_EXISTS = 'TRANSACTION_ALREADY_EXISTS',

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

export class TagIdEmpty extends BadRequest {
  constructor() {
    super(DomainError.of('TAG_ID_EMPTY'), 'Tag id is empty')
  }
}
export class TagIdInvalid extends BadRequest {
  constructor(id: string) {
    super(DomainError.of('TAG_ID_INVALID'), `Tag id "${id}" is invalid`)
  }
}
export class TagNameEmpty extends BadRequest {
  constructor() {
    super(DomainError.of('TAG_NAME_EMPTY'), 'Tag name is empty')
  }
}

export class TagNameInvalid extends BadRequest {
  constructor(name: string) {
    super(DomainError.of('TAG_NAME_INVALID'), `Tag name "${name}" is invalid`)
  }
}

export class TagNameTooShort extends BadRequest {
  constructor(name: string) {
    super(DomainError.of('TAG_NAME_TOO_SHORT'), `Tag name "${name}" is too short`)
  }
}

export class TagInvalid extends BadRequest {
  constructor(name: string) {
    super(DomainError.of('TAG_INVALID'), `Tag with name "${name}" is invalid`)
  }
}

export class TagDuplicated extends Conflict {
  constructor(name: string) {
    super(DomainError.of('TAG_DUPLICATED'), `Tag with name "${name}" already exists`)
  }
}
export class TagNotFound extends NotFound {
  constructor(id: string) {
    super(DomainError.of('TAG_NOT_FOUND'), `Tag with id "${id}" was not found`)
  }
}
