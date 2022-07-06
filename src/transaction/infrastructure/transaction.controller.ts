import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { PaginatedQuery } from 'shared/infrastruture/dtos/pagination-query'
import { Transaction } from '../domain/transaction'
import { RegisterTransactionDto } from '../infrastructure/dtos/register-transaction.dto'
import { Paginated } from 'shared/infrastruture/decorators/paginated.decorator'
import { TransactionError } from 'transaction/domain/transaction-error'
import {
  GetTransactionsQuery,
  GetTransactionQuery,
} from 'transaction/application/queries'
import {
  RegisterTransactionCommand,
  RemoveTransactionCommand,
} from 'transaction/application/commands'
import { Result } from 'shared/domain/result'
import { ErrorResponse } from 'shared/domain/error-response'

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  public async findAll(
    @Paginated()
    @Query()
    query: PaginatedQuery,
  ): Promise<ErrorResponse | Transaction[]> {
    const result = await this.queryBus.execute<
      GetTransactionsQuery,
      Result<Transaction[]>
    >(new GetTransactionsQuery(query))

    if (result.isFailure) {
      return this.handleError(result.getError())
    }

    return result.getOrThrow()
  }

  @Get(':id')
  public async findOne(@Param() id: string): Promise<ErrorResponse | Transaction> {
    const result = await this.queryBus.execute<GetTransactionQuery, Result<Transaction>>(
      new GetTransactionQuery(id),
    )

    if (result.isFailure) {
      return this.handleError(result.getError())
    }

    return result.getOrThrow()
  }

  @Post('register')
  public async register(
    @Body() transaction: RegisterTransactionDto,
  ): Promise<ErrorResponse | void> {
    const result = await this.commandBus.execute<RegisterTransactionCommand, Result>(
      new RegisterTransactionCommand(transaction),
    )

    if (result.isFailure) {
      return this.handleError(result.getError())
    }

    return result.getOrThrow()
  }

  @Delete('remove/:id')
  public async remove(@Param() id: string): Promise<ErrorResponse | void> {
    const result = await this.commandBus.execute<RemoveTransactionCommand, Result>(
      new RemoveTransactionCommand(id),
    )

    if (result.isFailure) {
      return this.handleError(result.getError())
    }

    return result.getOrThrow()
  }

  private handleError(error: Error): ErrorResponse {
    const HANDLED_ERRORS = {
      [TransactionError.TRANSACTION_NOT_FOUND]: {
        message: 'Transaction not found',
        status: 404,
      },
      [TransactionError.TRANSACTION_ALREADY_EXISTS]: {
        message: 'Transaction already exists',
        status: 409,
      },

      [TransactionError.INVALID_TRANSACTION]: {
        message: 'Invalid transaction',
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
