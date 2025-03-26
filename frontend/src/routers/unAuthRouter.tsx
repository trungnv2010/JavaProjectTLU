import { Loadable } from '@/components/Loading/Loadable'
import { lazyWithRetry } from '@/lib/utils/retryLazyLoad'
import { RouteObject } from 'react-router-dom'
import PublicRouter from './PublicRouter'

const LoginPage = Loadable(lazyWithRetry(() => import('@/pages/Login')))
const SignupPage = Loadable(lazyWithRetry(() => import('@/pages/Register')))
const VerifyPage = Loadable(lazyWithRetry(() => import('@/pages/Verify')))

export enum UNAUTHENTICATED_ROUTES {
  LOGIN = '/login',
  REGISTER = '/register',
  VERIFY = '/verify'
}

const unAuthRouter = (): RouteObject[] => {
  return [
    {
      path: UNAUTHENTICATED_ROUTES.LOGIN,
      element: (
        <PublicRouter>
          <LoginPage />
        </PublicRouter>
      )
    },
    {
      path: UNAUTHENTICATED_ROUTES.REGISTER,
      element: (
        <PublicRouter>
          <SignupPage />
        </PublicRouter>
      )
    },
    {
      path: UNAUTHENTICATED_ROUTES.VERIFY,
      element: (
        <PublicRouter>
          <VerifyPage />
        </PublicRouter>
      )
    }
  ]
}
export default unAuthRouter
