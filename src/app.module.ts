import { Module, Global } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { TransactionModule } from '@/transaction/transaction.module'
import { AuthModule } from '@/auth/auth.module'
import { SharedModule } from '@/shared/shared.module'

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ expandVariables: true }),
    MongooseModule.forRoot(String(process.env.MONGO_URI)),
    TransactionModule,
    AuthModule,
    SharedModule,
  ],
  controllers: [],
  providers: [],
  exports: [SharedModule],
})
export class AppModule {}
