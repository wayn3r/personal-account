import { Id, Params, User } from '@/shared/domain'
import { Mapper } from './mapper'
import { MongoUserDocument } from '../schemas'
import { Types } from 'mongoose'

export class MongoUserMapper extends Mapper<MongoUserDocument, User> {
  map(from: MongoUserDocument): User {
    const UserInstance = class extends User {
      static load(params: Params<User>): User {
        return new UserInstance(params)
      }
    }
    return UserInstance.load({
      id: Id.load(from._id.toString()),
      externalId: from.externalId,
      name: from.name,
      lastName: from.lastName,
      email: from.email,
      locale: from.locale,
      picture: from.picture,
      createdAt: from.createdAt,
      updatedAt: from.updatedAt,
    })
  }

  reverseMap(from: User): MongoUserDocument {
    const document = new MongoUserDocument()
    document._id = new Types.ObjectId(from.id.toString())
    document.externalId = from.externalId
    document.name = from.name
    document.lastName = from.lastName
    document.email = from.email
    document.createdAt = from.createdAt
    document.updatedAt = from.updatedAt
    return document
  }
}
