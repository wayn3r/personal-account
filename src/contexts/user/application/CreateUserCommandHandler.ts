import { Email } from '../domain/Email'
import { User } from '../domain/User'
import { UserId } from '../domain/UserId'
import { UserName } from '../domain/UserName'
import { CreateUserCommand } from './CreateUserCommand'
import { UserCreator } from './UserCreator'

export class CreateUserCommandHandler {
    public constructor(private userCreator: UserCreator) {}

    public async handle(command: CreateUserCommand) {
        const id = new UserId(command.id)
        const name = new UserName(command.name)
        const email = new Email(command.email)
        const user = new User(id, name, email)
        return await this.userCreator.create(user)
    }
}
