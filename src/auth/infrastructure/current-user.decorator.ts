import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

export const CurrentUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>()
  return request.currentUser
})
