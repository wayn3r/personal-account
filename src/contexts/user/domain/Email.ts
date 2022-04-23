export class Email {
    public constructor(readonly value: string) {
        this.isValidEmail()
    }

    private isValidEmail() {
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/gi.test(this.value)) {
            throw new Error('Invalid email')
        }
    }
}
