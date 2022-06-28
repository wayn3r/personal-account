import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type TransactionDocument = TransactionModel & Document

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
export class TransactionModel {
    @Prop({ required: true, unique: true, type: String })
    name: string

    @Prop({ type: String })
    description: string

    @Prop({ required: true, type: Number, default: Date.now })
    date: Date

    @Prop({ required: true, type: Number })
    amount: number

    @Prop({ required: true, type: Boolean, default: false })
    isCredit: boolean

    @Prop({ required: true, type: String })
    type: string

    @Prop({ required: true, type: String })
    moneyState: string

    @Prop({ required: true, type: Array, default: [] })
    tags: string[]
}

export const TransactionSchema = SchemaFactory.createForClass(TransactionModel)
