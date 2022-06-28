import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { TransactionModule } from 'transaction/transaction.module'

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGO_URI),
        TransactionModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
