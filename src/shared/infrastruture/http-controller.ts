import { HttpCode, HttpStatus, Logger } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { BadRequest, Failure, DomainError } from 'shared/domain'
import { ErrorResponse } from './dtos'

export class HttpController {
  protected readonly logger: Logger

  constructor(
    protected readonly queryBus: QueryBus,
    protected readonly commandBus: CommandBus,
  ) {
    this.logger = new Logger(this.constructor.name)
  }

  protected handleError(failure: Failure): ErrorResponse {
    this.logger.error(failure.getError())

    if (failure instanceof BadRequest) {
      return this.badRequest(failure.getError(), failure.message)
    }

    return this.internalServerError(
      DomainError.of('UNHANDLED_ERROR'),
      'An unexpected error has ocurred. We are working to fix this as soon as possible.',
    )
  }

  @HttpCode(HttpStatus.BAD_REQUEST)
  protected badRequest(error: DomainError, message: string): ErrorResponse {
    return new ErrorResponse(error.code, message, HttpStatus.BAD_REQUEST)
  }

  @HttpCode(HttpStatus.INTERNAL_SERVER_ERROR)
  protected internalServerError(error: DomainError, message: string): ErrorResponse {
    return new ErrorResponse(error.code, message, HttpStatus.INTERNAL_SERVER_ERROR)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  protected noContent(): void {
    return
  }
}
