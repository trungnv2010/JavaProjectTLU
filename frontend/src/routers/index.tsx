import { useRoutes } from 'react-router-dom'
import unAuthRouter from './unAuthRouter'
import { Loadable } from '@/components/Loading/Loadable'
import { lazyWithRetry } from '@/lib/utils/retryLazyLoad'
import { ROOT_ROUTES } from '@/common/constants/router'
import { CookieProvider } from '@/lib/provider/cookieProvider'
import { lazy, useContext } from 'react'
import { AuthContext } from '@/lib/provider/authProvider'
import ProtectedRouter from './ProtectedRouter'
import FollowShopee from '@/pages/FollowShopee'

const AppRouter = () => {
  const { state } = useContext(AuthContext)
  return useRoutes([
    ...unAuthRouter(),
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          path: '/',
          element: (
            <ProtectedRouter auth={state.auth} hasPermission={true}>
              <Homepage />
            </ProtectedRouter>
          )
        },
        {
          path: ROOT_ROUTES.LADING_CODE,
          element: (
            <ProtectedRouter auth={state.auth} hasPermission={true}>
              <CookieProvider>
                <LadingCodePage />
              </CookieProvider>
            </ProtectedRouter>
          )
        },
        {
          path: '/order',
          element: <OrderDetailsPage />
        },
        {
          path: '/follow',
          element: <FollowShopee />
        }
      ]
    },
    {
      path: '*',
      element: <div>not found</div>
    }
  ])
}

export default AppRouter

const Homepage = Loadable(lazyWithRetry(() => import('@/pages/Home')))
const LadingCodePage = Loadable(lazyWithRetry(() => import('@/pages/CheckLadingCode')))
const MainLayout = Loadable(lazyWithRetry(() => import('@/components/Wrapper/MainLayout')))
const OrderDetailsPage = Loadable(lazyWithRetry(() => import('@/pages/OrderDetails')));
const FollowShopee = Loadable(lazyWithRetry(() => import('@/pages/FollowShopee')));
