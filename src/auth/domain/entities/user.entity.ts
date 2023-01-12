import { Id } from '@/shared/domain'

export class User {
  constructor(
    public readonly id: Id,
    public readonly email: { value: string; verified: boolean },
    public readonly name: { firstName: string; lastName: string },
    public readonly picture: string,
    public readonly locale: string,
    public readonly createdAt: Date,
  ) {}
}
