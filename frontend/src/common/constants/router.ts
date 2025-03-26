import { UNAUTHENTICATED_ROUTES } from '@/routers/unAuthRouter'

export enum ROOT_ROUTES {
  ROOT = '/',
  LOGIN = UNAUTHENTICATED_ROUTES.LOGIN,
  REGISTER = UNAUTHENTICATED_ROUTES.REGISTER,
  LADING_CODE = '/check-lading-code'
}
