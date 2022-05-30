import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.setGlobalPrefix(`api/${process.env.APP_VERSION}`)
    app.useGlobalPipes(new ValidationPipe())
    app.enableCors()
    await app.listen(process.env.APP_PORT || 8000)
}
bootstrap()
