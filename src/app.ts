import express, { Express } from 'express'
import { config as configEnviroment } from 'dotenv'

configEnviroment()
const app: Express = express()
const port: number = (process.env.PORT ?? 5000) as number

app.listen(port, () => console.log(`Server running at http://localhost:${port}`))
