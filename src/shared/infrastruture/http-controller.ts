import { Injectable } from '@nestjs/common'
import { HttpStatus, Logger } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { Response } from 'express'
import { BadRequest, Failure, DomainError } from 'shared/domain'
import { ErrorResponse } from './dtos'

@Injectable()
export class HttpController {
  protected readonly logger: Logger

  constructor(
    protected readonly queryBus: QueryBus,
    protected readonly commandBus: CommandBus,
  ) {
    this.logger = new Logger(this.constructor.name)
  }

  protected handleError(res: Response, failure: Failure): Response<ErrorResponse> {
    this.logger.error(failure.getErrorOrThrow())

    if (failure instanceof BadRequest) {
      return this.badRequest(res, failure.getErrorOrThrow(), failure.message)
    }

    return this.internalServerError(
      res,
      DomainError.of('UNHANDLED_ERROR'),
      'An unexpected error has ocurred. We are working to fix this as soon as possible.',
    )
  }

  protected badRequest(
    res: Response,
    error: DomainError,
    message: string,
  ): Response<ErrorResponse> {
    const errorResponse = new ErrorResponse(error.code, message, HttpStatus.BAD_REQUEST)
    return res.status(HttpStatus.BAD_REQUEST).json(errorResponse)
  }

  protected internalServerError(
    res: Response,
    error: DomainError,
    message: string,
  ): Response<ErrorResponse> {
    const errorResponse = new ErrorResponse(
      error.code,
      message,
      HttpStatus.INTERNAL_SERVER_ERROR,
    )
    return res.status(HttpStatus.BAD_REQUEST).json(errorResponse)
  }

  protected noContent(res: Response): Response<void> {
    return res.status(HttpStatus.NO_CONTENT).send()
  }
}
