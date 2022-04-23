import { Controller, Get } from '@nestjs/common'
import { User } from 'contexts/user/domain/User'
import { AppService } from './app.service'

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getUser(): Promise<User> {
        const name = 'John Doe'
        const email = 'john@doe.com'
        return this.appService.saveUser({ name, email })
    }
}
