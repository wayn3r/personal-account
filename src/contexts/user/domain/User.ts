import { Email } from './Email'

export class User {
    public constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: Email,
    ) {}
}
