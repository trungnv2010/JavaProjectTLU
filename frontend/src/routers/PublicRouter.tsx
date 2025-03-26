import { localStorageAuthService } from '@/common/storages/auth-storages'
import { TChildProps } from '@/types'
import { Navigate } from 'react-router-dom'

const PublicRouter = ({ children }: TChildProps) => {
  const accessToken = localStorageAuthService.getAccessToken()

  return <>{!accessToken ? <>{children}</> : <Navigate to='/' replace />}</>
}
export default PublicRouter
