import { Email } from 'contexts/user/domain/Email'
import { User } from 'contexts/user/domain/User'
import { CreateUserCommand } from './CreateUserCommand'
import { UserCreator } from './UserCreator'

export class CreateUserCommandHandler {
    public constructor(private userCreator: UserCreator) {}

    public async handle(command: CreateUserCommand) {
        const { id, name, email } = command
        const userEmail = new Email(email)
        const user = new User(id, name, userEmail)
        return await this.userCreator.create(user)
    }
}
