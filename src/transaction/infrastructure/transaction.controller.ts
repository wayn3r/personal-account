import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { PaginatedQuery } from 'shared/infrastruture/dtos/pagination-query'
import { Transaction } from '../domain/transaction'
import { RegisterTransactionDto } from '../infrastructure/dtos/register-transaction.dto'
import { Paginated } from 'shared/infrastruture/decorators/paginated.decorator'
import {
  GetTransactionsQuery,
  GetTransactionQuery,
} from 'transaction/application/queries'
import {
  RegisterTransactionCommand,
  RemoveTransactionCommand,
} from 'transaction/application/commands'

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
  ): Promise<Transaction[]> {
    const result = await this.queryBus.execute<GetTransactionsQuery, Transaction[]>(
      new GetTransactionsQuery(query),
    )

    return result
  }

  @Get(':id')
  public async findOne(@Param() id: string): Promise<Transaction> {
    const result = await this.queryBus.execute<GetTransactionQuery, Transaction>(
      new GetTransactionQuery(id),
    )

    return result
  }

  @Post('register')
  public async register(@Body() transaction: RegisterTransactionDto): Promise<void> {
    await this.commandBus.execute<RegisterTransactionCommand, void>(
      new RegisterTransactionCommand(transaction),
    )
  }

  @Delete('remove/:id')
  public async remove(@Param() id: string): Promise<void> {
    await this.commandBus.execute<RemoveTransactionCommand, void>(
      new RemoveTransactionCommand(id),
    )
  }
}
