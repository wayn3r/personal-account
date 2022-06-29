import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

export const Paginated = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>()
  const pagination: any = {}
  if (request.query.page) {
    pagination.page = parseInt(<string>request.query.page)
  }
  if (request.query.limit) {
    pagination.limit = parseInt(<string>request.query.limit)
  }
  if (request.query.order) {
    pagination.order = parseInt(<string>request.query.order)
  }
  Object.assign(request.query, pagination)
  return request
})
