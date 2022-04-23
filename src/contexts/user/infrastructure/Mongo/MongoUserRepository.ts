import { UserRepository } from 'contexts/user/domain/UserRepository'
import { User } from 'contexts/user/domain/User'

export class MongoUserRepository implements UserRepository {
    public async save(user: User): Promise<User> {
        console.log(user)
        return user
    }
}
