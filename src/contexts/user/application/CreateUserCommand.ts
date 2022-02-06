type Params = {
    id: string
    name: string
    email: string
}
export class CreateUserCommand {
    readonly id: string
    readonly name: string
    readonly email: string

    public constructor({ id, name, email }: Params) {
        this.id = id
        this.name = name
        this.email = email
    }
}
