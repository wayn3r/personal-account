import { Optional, Result, User, UserRepository } from '@/shared/domain'
import { Model } from 'mongoose'
import { MongoUserDocument } from '../schemas'
import { MongoUserMapper } from '../mappers'
import { InjectModel } from '@nestjs/mongoose'

export class MongoUserRepository implements UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<MongoUserDocument>,
    private readonly userMapper: MongoUserMapper,
  ) {}
  async save(user: User): Promise<Result> {
    const { _id, ...document } = this.userMapper.reverseMap(user)
    return this.userModel
      .updateOne({ _id }, document, { upsert: true })
      .then(() => Result.ok())
      .catch((error) => Result.fail(error))
  }
  async findByExternalId(externalId: string): Promise<Result<Optional<User>>> {
    return this.userModel
      .findOne({ externalId })
      .then((document) => Optional.of(document))
      .then((optional) => optional.map((document) => this.userMapper.map(document)))
      .then((optional) => Result.ok(optional))
      .catch((error) => Result.fail(error))
  }
}
