import { Params } from '@/shared/domain'

export class ErrorResponse {
  public readonly code: string
  public readonly message: string
  public readonly status: number

  constructor(params: Params<ErrorResponse>) {
    this.code = params.code
    this.message = params.message
    this.status = params.status
  }
}
