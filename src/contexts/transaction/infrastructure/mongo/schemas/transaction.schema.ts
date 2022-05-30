import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type TransactionDocument = Transaction & Document

@Schema({
    toJSON: {
        transform(_, doc) {
            const { _id, ...transaction } = doc
            return {
                id: _id,
                ...transaction,
            }
        },
        versionKey: false,
    },
})
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
