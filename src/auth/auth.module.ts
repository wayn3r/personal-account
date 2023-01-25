import { OAuth2Client } from 'google-auth-library'
import { Module } from '@nestjs/common'
import { Config } from '@/config'
import { AuthControllers, AuthMappers, GoogleAuthRepository } from './infrastructure'
import { AuthRepositoryProvider } from './domain'
import { AuthCommandHandlers } from './application'
import { CqrsModule } from '@nestjs/cqrs'
import { HttpModule } from '@nestjs/axios'
import { SharedModule } from '@/shared/shared.module'

@Module({
  imports: [CqrsModule, HttpModule, SharedModule],
  controllers: [...AuthControllers],
  providers: [
    ...AuthCommandHandlers,
    ...AuthMappers,
    {
      provide: OAuth2Client,
      useFactory: (config: Config) => new OAuth2Client(config.auth.google.clientId),
      inject: [Config],
    },
    { provide: AuthRepositoryProvider, useClass: GoogleAuthRepository },
  ],
})
export class AuthModule {}
