import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({ origin: '*', allowedHeaders: '*' })
  app.setGlobalPrefix(String(process.env.GLOBAL_PREFIX))
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  )
  await app.listen(Number(process.env.APP_PORT) || 8000)
}
bootstrap()
