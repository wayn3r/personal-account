import { AuthRepository } from '@/auth/domain'
import { Config } from '@/config'
import { Result, Id, Optional, Unauthorized, DomainError } from '@/shared/domain'
import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { OAuth2Client } from 'google-auth-library'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class GoogleAuthRepository implements AuthRepository {
  constructor(
    private readonly authClient: OAuth2Client,
    private readonly http: HttpService,
    private readonly config: Config,
  ) {}
  async verify(token: string): Promise<Result<Id>> {
    return await this.authClient
      .verifyIdToken({
        idToken: token,
        audience: this.config.auth.google.clientId,
      })
      .then((ticket) => Optional.of(ticket.getPayload()))
      .then((optional) =>
        optional.validateIsPresent(
          () => new Unauthorized(DomainError.of('INVALID_TOKEN')),
        ),
      )
      .then((result) => result.map((user) => Id.load(user.sub)))
      .catch((error) => Result.fail(error))
  }

  async getProfile(token: string): Promise<Result<Optional<any>>> {
    const url = this.getEndpoint(token)
    return firstValueFrom(this.http.get(url))
      .then((response) => Optional.of(response.data))
      .then((optional) => Result.ok(optional))
      .catch((error) => Result.fail(error))
  }

  private getEndpoint(token: string): string {
    const url = new URL(this.config.auth.google.authEndpoint)
    url.searchParams.append('id_token', token)
    return url.toString()
  }
}
