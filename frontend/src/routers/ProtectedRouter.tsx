import { localStorageAuthService } from '@/common/storages/auth-storages'
import LoadingScreen from '@/components/Loading/LoadingScreen'
import { IAuth } from '@/types/auth'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

type AuthGuardProps = {
  children: JSX.Element | null
  hasPermission?: boolean
  auth: Partial<IAuth> | null
}

const ProtectedRouter = ({ children, hasPermission, auth }: AuthGuardProps) => {
  console.log('🚀 ~ ProtectedRouter ~ auth:', auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (!auth) {
      return
    }
    if (!auth) {
      localStorageAuthService.removeAccessToken()
      navigate('/login')
    }
  }, [auth, navigate])
  return auth ? (
    hasPermission ? (
      children
    ) : (
      <div>
        <h1>403</h1>
        <h2>Permission Denied</h2>
      </div>
    )
  ) : (
    <LoadingScreen />
  )
}
export default ProtectedRouter
