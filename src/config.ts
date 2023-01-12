import { ConfigService } from '@nestjs/config'

type AuthConfig = {
  readonly google: { readonly clientId: string; readonly authEndpoint: string }
}

export class Config {
  public readonly auth: AuthConfig
  constructor(configService: ConfigService) {
    this.auth = {
      google: {
        clientId: <string>configService.get('AUTH_GOOGLE_CLIENT_ID'),
        authEndpoint: <string>configService.get('AUTH_GOOGLE_AUTH_ENDPOINT'),
      },
    }
  }
}
