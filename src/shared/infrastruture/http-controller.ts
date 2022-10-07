import { Injectable } from '@nestjs/common'
import { HttpStatus, Logger } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { Response } from 'express'
import { BadRequest, Failure, DomainError, NotFound, Conflict } from 'shared/domain'
import { ErrorResponse } from './dtos'

@Injectable()
export class HttpController {
  protected readonly logger: Logger
  protected readonly response: Response

  constructor(
    protected readonly queryBus: QueryBus,
    protected readonly commandBus: CommandBus,
  ) {
    this.logger = new Logger(this.constructor.name)
    // res = this.context.switchToHttp().getResponse()
  }

  protected handleError(res: Response, failure: Failure): Response<ErrorResponse> {
    this.logger.error(failure.getErrorOrThrow())

    if (failure instanceof BadRequest) {
      return this.badRequest(res, failure.getErrorOrThrow(), failure.message)
    }
    if (failure instanceof NotFound) {
      return this.notFound(res, failure.getErrorOrThrow(), failure.message)
    }
    if (failure instanceof Conflict) {
      return this.conflict(res, failure.getErrorOrThrow(), failure.message)
    }

    return this.internalServerError(
      res,
      DomainError.of('UNHANDLED_ERROR'),
      'An unexpected error has ocurred. We are working to fix this as soon as possible.',
    )
  }
  protected ok<T>(res: Response, data: T): Response<T> {
    return res.status(HttpStatus.OK).json(data)
  }
  protected noContent(res: Response): Response<void> {
    return res.status(HttpStatus.NO_CONTENT).send()
  }

  protected badRequest(
    res: Response,
    error: DomainError,
    message: string,
  ): Response<ErrorResponse> {
    const errorResponse = new ErrorResponse(error.code, message, HttpStatus.BAD_REQUEST)
    return res.status(HttpStatus.BAD_REQUEST).json(errorResponse)
  }
  protected notFound(
    res: Response,
    error: DomainError,
    message: string,
  ): Response<ErrorResponse> {
    const errorResponse = new ErrorResponse(error.code, message, HttpStatus.NOT_FOUND)
    return res.status(HttpStatus.NOT_FOUND).json(errorResponse)
  }
  protected conflict(
    res: Response,
    error: DomainError,
    message: string,
  ): Response<ErrorResponse> {
    const errorResponse = new ErrorResponse(error.code, message, HttpStatus.CONFLICT)
    return res.status(HttpStatus.CONFLICT).json(errorResponse)
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
}
