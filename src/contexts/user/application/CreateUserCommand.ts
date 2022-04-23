interface CreateUserCommandParams {
    id: string
    name: string
    email: string
}
export class CreateUserCommand {
    public readonly id: string
    public readonly name: string
    public readonly email: string

    public constructor({ id, name, email }: CreateUserCommandParams) {
        this.id = id
        this.name = name
        this.email = email
    }
}
