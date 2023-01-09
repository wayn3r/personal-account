import { Module, Global } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { TransactionsModule } from '@/transaction/transactions.module'
import { CyclesModule } from '@/cycles/cycles.module'
import { AuthModule } from '@/auth/auth.module'
import { SharedModule } from '@/shared/shared.module'

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ expandVariables: true }),
    MongooseModule.forRoot(String(process.env.MONGO_URI)),
    TransactionsModule,
    CyclesModule,
    AuthModule,
    SharedModule,
  ],
  controllers: [],
  providers: [],
  exports: [SharedModule],
})
export class AppModule {}
