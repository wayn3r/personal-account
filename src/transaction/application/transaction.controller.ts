import { Controller, Get, Inject, Query } from '@nestjs/common'
import { InjectionConfig } from 'injection-config'
import { Transaction } from '../domain/transaction'
import { TransactionRepository } from '../domain/transaction-repository'
import { TransactionQueryDto } from './transaction-query.dto'

@Controller('transaction')
export class TransactionController {
    constructor(
        @Inject(InjectionConfig.TRANSACTION_REPOSITORY)
        private readonly transactionRepository: TransactionRepository,
    ) {}

    @Get()
    public async findAll(
        @Query() query: TransactionQueryDto,
    ): Promise<Transaction[]> {
        const transactions = await this.transactionRepository.findAll(query)
        return transactions
    }
}
