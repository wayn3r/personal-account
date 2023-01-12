import { UserLoggedIn } from '@/auth/domain'
import { EventsHandler, IEventHandler } from '@nestjs/cqrs'

@EventsHandler(UserLoggedIn)
export class UserLoggedInEventHandler implements IEventHandler<UserLoggedIn> {
  async handle(event: UserLoggedIn): Promise<void> {
    const { userId } = event
  }
}
