import React, { createContext, ReactNode, useEffect, useReducer, useMemo, useCallback } from 'react'
import authReducer, { initialState, TAuthAction, TAuthReducer } from '../reducer/authReducer'
import { authApi } from '@/apis/auth'
import { useLocation } from 'react-router-dom'
import { PUBLIC_ROUTES } from '@/common/constants'

const AuthContext = createContext<{
  state: TAuthReducer
  dispatch: React.Dispatch<TAuthAction>
}>({
  state: initialState,
  dispatch: () => {}
})

interface AuthProviderProps {
  children: ReactNode
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const { pathname } = useLocation()
  const getMe = useCallback(async () => {
    try {
      const res = await authApi.getMe()
      dispatch({ type: 'GET_ME', payload: res })
    } catch (error) {
      return error
    }
  }, [])
  const isPublicRoute = useMemo(() => PUBLIC_ROUTES.some((route) => pathname.includes(route)), [pathname])
  useEffect(() => {
    if (!isPublicRoute) {
      getMe()
    }
  }, [getMe, isPublicRoute])

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch])

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
