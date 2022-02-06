import { config as configEnviroment } from 'dotenv'
import { HttpServer } from 'app/HttpServer'

configEnviroment()

const port: number = (process.env.PORT ?? 5000) as number

const server: HttpServer = new HttpServer(port)

server.start()
