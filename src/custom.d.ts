import { User } from './shared/domain'

declare global {
  namespace Express {
    interface Request {
      currentUser?: User
    }
  }
}
