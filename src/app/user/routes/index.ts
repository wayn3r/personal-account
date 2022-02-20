import { Router } from 'express'
import { UserPostController } from 'app/user/controller/UserPostController'

const router: Router = Router()
router.post('/', new UserPostController().process)

export const userRouter = router
