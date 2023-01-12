import { Id } from '@/shared/domain'

export class UserLoggedIn {
  constructor(public readonly userId: Id) {}
}
