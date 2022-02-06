import { AgregateRoot } from 'contexts/shared/domain/AgregateRoot'
import { Email } from './Email'
import { UserId } from './UserId'
import { UserName } from './UserName'

export class User extends AgregateRoot {
    public constructor(private id: UserId, private name: UserName, private email: Email) {
        super()
    }

    public toJSON(): { [key: string]: string | number } {
        return {
            id: this.id.value,
            name: this.name.value,
            email: this.email.value,
        }
    }
}
