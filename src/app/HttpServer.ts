import express, { Express, json } from 'express'
import { Server } from 'http'
import { userRouter } from 'app/user/routes'

export class HttpServer {
    private server: undefined | Server
    private express: Express

    public constructor(private port: number) {
        this.express = express()
        this.middlewares()
        this.routes()
    }

    private middlewares() {
        this.express.use(json())
    }

    private routes() {
        this.express.use('/user', userRouter)
    }

    public start() {
        this.server = this.express.listen(this.port, () =>
            console.log(`Server running at http://localhost:${this.port}`),
        )
        return this.server
    }
}
