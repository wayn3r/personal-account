import { Injectable } from '@nestjs/common'
import { HttpStatus, Logger } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { Response } from 'express'
import { BadRequest, Failure, DomainError, NotFound, Conflict } from '@/shared/domain/entities'
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
  }

  protected handleError(res: Response, failure: Failure): Response<ErrorResponse> {
    const error = failure.getErrorOrThrow()
    this.logger.error(`[Code: ${error.code}] ${error.message}`)
    this.logger.error(error.stack)

    if (failure instanceof BadRequest) {
      return this.badRequest(res, error, failure.message)
    }
    if (failure instanceof NotFound) {
      return this.notFound(res, error, failure.message)
    }
    if (failure instanceof Conflict) {
      return this.conflict(res, error, failure.message)
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
