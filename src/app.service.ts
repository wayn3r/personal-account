import { Injectable } from '@nestjs/common'
import { CreateUserCommand } from 'contexts/user/application/CreateUserCommand'
import { CreateUserCommandHandler } from 'contexts/user/application/CreateUserCommandHandler'
import { UserCreator } from 'contexts/user/application/UserCreator'
import { User } from 'contexts/user/domain/User'
import { MongoUserRepository } from 'contexts/user/infrastructure/Mongo/MongoUserRepository'

interface UserParams {
    name: string
    email: string
}
@Injectable()
export class AppService {
    public async saveUser(user: UserParams): Promise<User> {
        const { name, email } = user
        const command = new CreateUserCommand({ id: '', name, email })
        const repository = new MongoUserRepository()
        const creator = new UserCreator(repository)
        const handler = new CreateUserCommandHandler(creator)
        return await handler.handle(command)
    }
}
