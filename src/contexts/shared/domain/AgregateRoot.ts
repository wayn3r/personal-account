export abstract class AgregateRoot {
    public abstract toJSON(): { [key: string]: string | number }
}
