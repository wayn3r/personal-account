import { CreateUserCommand } from 'contexts/user/application/CreateUserCommand'
import { CreateUserCommandHandler } from 'contexts/user/application/CreateUserCommandHandler'
import { UserCreator } from 'contexts/user/application/UserCreator'
import { UserRepository } from 'contexts/user/domain/UserRepository'
import { MongoUserRepository } from 'contexts/user/infrastructure/Mongo/MongoUserRepository'
import { Request, Response } from 'express'

export class UserPostController {
    public async process(req: Request, res: Response) {
        const createUserCommand: CreateUserCommand = new CreateUserCommand({
            id: req.body.id,
            name: req.body.name,
            email: req.body.email,
        })

        const repository: UserRepository = new MongoUserRepository()
        const creator: UserCreator = new UserCreator(repository)
        const hanler: CreateUserCommandHandler = new CreateUserCommandHandler(creator)
        const user = await hanler.handle(createUserCommand)

        return res.status(201).json(user)
    }
}
