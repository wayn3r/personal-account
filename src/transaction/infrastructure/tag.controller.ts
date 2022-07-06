import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { GetTags } from 'transaction/application/queries'
import { CreateTagCommand, RemoveTagCommand } from 'transaction/application/commands'
import { Tag } from 'transaction/domain/tag'
import { Result } from 'shared/domain/result'
import { ErrorResponse } from 'shared/domain/error-response'
import { TransactionError } from 'transaction/domain/transaction-error'

@Controller('tags')
export class TagController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  public async findAll(): Promise<ErrorResponse | Tag[]> {
    const result = await this.queryBus.execute<GetTags, Result<Tag[]>>(new GetTags())
    if (result.isFailure) {
      return this.handleError(result.getError())
    }
    return result.getValue()
  }

  @Post('create')
  public async create(@Body() body: { name: string }): Promise<ErrorResponse | void> {
    const commandResult = CreateTagCommand.create(body.name)
    if (commandResult.isFailure) {
      return this.handleError(commandResult.getError())
    }
    const result = await this.commandBus.execute<CreateTagCommand, Result>(
      commandResult.getValue(),
    )
    if (result.isFailure) {
      return this.handleError(result.getError())
    }
  }

  @Delete('remove/:id')
  public async remove(@Param() id: string): Promise<ErrorResponse | void> {
    const result = await this.commandBus.execute<RemoveTagCommand, Result>(
      new RemoveTagCommand(id),
    )
    if (result.isFailure) {
      return this.handleError(result.getError())
    }
  }

  private handleError(error: Error): ErrorResponse {
    const HANDLED_ERRORS = {
      [TransactionError.TAG_NOT_FOUND]: {
        message: 'Tag not found',
        status: 404,
      },
      [TransactionError.TAG_ALREADY_EXISTS]: {
        message: 'Tag already exists',
        status: 409,
      },

      [TransactionError.INVALID_TAG]: {
        message: 'Invalid tag',
        status: 400,
      },
    }

    const errorCode = error.message
    const handledError = HANDLED_ERRORS[errorCode]
    if (!handledError) {
      throw error
    }

    return {
      code: errorCode,
      message: handledError.message as string,
      status: HANDLED_ERRORS[errorCode].status as number,
    }
  }
}
