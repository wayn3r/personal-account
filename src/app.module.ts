import { Module, Global } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { TransactionsModule } from '@/transactions/transactions.module'
import { CyclesModule } from '@/cycles/cycles.module'
import { AuthModule } from '@/auth/auth.module'
import { SharedModule } from '@/shared/shared.module'
import { Config } from './config'

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
  providers: [
    {
      provide: Config,
      useFactory: (configService: ConfigService) => new Config(configService),
      inject: [ConfigService],
    },
  ],
  exports: [SharedModule, Config],
})
export class AppModule {}
