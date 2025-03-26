import { Suspense } from 'react'
import LoadingScreen from './LoadingScreen'

export const Loadable = (Component: any) => (props: any) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  )
}
