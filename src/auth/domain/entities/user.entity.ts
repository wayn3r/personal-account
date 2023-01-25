import { AggregateRoot } from '@/shared/domain'

export class ExternalUser extends AggregateRoot<ExternalUser> {
  public readonly id: string
  public readonly email: { readonly id: string; readonly verified: boolean }
  public readonly name: string
  public readonly lastName: string
  public readonly picture: string
  public readonly locale: string
}
