import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type TransactionDocument = Transaction & Document

@Schema()
export class Transaction {
    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    credit: number

    @Prop({ required: true })
    debit: number

    @Prop({ required: true })
    balance: number

    @Prop({ required: true })
    date: Date
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction)
