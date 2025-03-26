import { createContext, useEffect, useMemo, useReducer } from 'react'
import cookieReducer, { initialState, TCookieAction, TCookieReducer } from '../reducer/cookieReducer'
import { cookieApi } from '@/apis/cookieApi'

const CookieContext = createContext<{
  state: TCookieReducer
  dispatch: React.Dispatch<TCookieAction>
}>({
  state: initialState,
  dispatch: () => {}
})

type Props = {
  children: React.ReactNode
}

const CookieProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(cookieReducer, initialState)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await cookieApi.getAllCookie()
        dispatch({ type: 'GET_ALL', payload: res })
      } catch (error) {
        return error
      }
    })()
  }, [])

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch])

  return <CookieContext.Provider value={contextValue}>{children}</CookieContext.Provider>
}

export { CookieContext, CookieProvider }
