import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { GetTransactionQuery } from '@/transactions/infrastructure'
import { RemoveTransactionCommand } from '@/transactions/application'
import { Result } from '@/shared/domain/entities'
import { ErrorResponse } from '@/shared/infrastruture'
import { Transaction, TransactionError } from '@/transactions/domain'
import { AuthGuard } from '@/auth/infrastructure'

@Controller('transactions')
@UseGuards(AuthGuard)
export class TransactionController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get(':id')
  public async findOne(@Param() id: string): Promise<ErrorResponse | Transaction> {
    const result = await this.queryBus.execute<GetTransactionQuery, Result<Transaction>>(
      new GetTransactionQuery(id),
    )

    if (result.isFailure()) {
      return this.handleError(result.getErrorOrThrow())
    }

    return result.getOrThrow()
  }

  @Delete('remove/:id')
  public async remove(@Param() id: string): Promise<ErrorResponse | void> {
    const result = await this.commandBus.execute<RemoveTransactionCommand, Result>(
      new RemoveTransactionCommand(id),
    )

    if (result.isFailure()) {
      return this.handleError(result.getErrorOrThrow())
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

    const errorCode = error.message as keyof typeof HANDLED_ERRORS
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
