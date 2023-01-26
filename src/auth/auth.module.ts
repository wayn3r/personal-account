import { OAuth2Client } from 'google-auth-library'
import { Module } from '@nestjs/common'
import { Config } from '@/config'
import { AuthControllers, AuthGuard, AuthMappers, GoogleAuthRepository } from './infrastructure'
import { AuthRepositoryProvider } from './domain'
import { AuthCommandHandlers } from './application'
import { CqrsModule } from '@nestjs/cqrs'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [CqrsModule, HttpModule],
  controllers: [...AuthControllers],
  providers: [
    AuthGuard,
    ...AuthCommandHandlers,
    ...AuthMappers,
    {
      provide: OAuth2Client,
      useFactory: (config: Config) => new OAuth2Client(config.auth.google.clientId),
      inject: [Config],
    },
    { provide: AuthRepositoryProvider, useClass: GoogleAuthRepository },
  ],
  exports: [AuthGuard, AuthRepositoryProvider],
})
export class AuthModule {}
