import { ExternalUser } from '@/auth/domain'
import { Params } from '@/shared/domain'
import { Mapper } from '@/shared/infrastruture'
import { TokenPayload } from 'google-auth-library'

export class GoogleExternalUserMapper extends Mapper<TokenPayload, ExternalUser> {
  map(from: TokenPayload): ExternalUser {
    const ExternalUserInstace = class extends ExternalUser {
      static load(params: Params<ExternalUser>): ExternalUser {
        return new ExternalUser(params)
      }
    }
    return ExternalUserInstace.load({
      id: from.sub,
      email: { id: <string>from.email, verified: Boolean(from.email_verified) },
      name: <string>from.given_name,
      lastName: <string>from.family_name,
      picture: <string>from.picture,
      locale: <string>from.locale,
    })
  }
  reverseMap(from: ExternalUser): TokenPayload {
    throw new Error('Method not implemented.' + from)
  }
}
