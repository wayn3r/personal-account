import { User } from 'contexts/user/domain/User'
import { UserRepository } from 'contexts/user/domain/UserRepository'

export class UserCreator {
    public constructor(private repository: UserRepository) {}

    public async create(user: User): Promise<User> {
        return await this.repository.save(user)
    }
}
