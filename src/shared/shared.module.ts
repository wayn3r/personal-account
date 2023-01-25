import { Module } from '@nestjs/common'
import { User, UserRepositoryProvider } from './domain'
import { MongoUserRepository, MongoUserSchema, SharedMappers } from './infrastruture'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: MongoUserSchema }])],
  controllers: [],
  providers: [
    ...SharedMappers,
    { provide: UserRepositoryProvider, useClass: MongoUserRepository },
  ],
  exports: [UserRepositoryProvider],
})
export class SharedModule {}
