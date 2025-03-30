// ** React Imports
import {createContext, ReactNode, useEffect, useState} from 'react'

// ** Next Import
import {useRouter} from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import {AuthValuesType, ErrCallbackType, LoginParams, UserDataType} from './types'
import {loginAuth} from "src/services/auth";
import {CONFIG_API} from "src/configs/api";
import {clearLocalUserData} from "src/helpers/storage";
import instanceAxios from "src/helpers/axios";

// ** Defaults
const defaultProvider: AuthValuesType = {
    user: null,
    loading: true,
    setUser: () => null,
    setLoading: () => Boolean,
    login: () => Promise.resolve(),
    logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
    children: ReactNode
}

const AuthProvider = ({children}: Props) => {
    // ** States
    const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
    const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

    // ** Hooks
    const router = useRouter()

    useEffect(() => {
        const initAuth = async (): Promise<void> => {
            const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
            if (storedToken) {
                setLoading(true)
                await instanceAxios
                    .get(CONFIG_API.AUTH.AUTH_ME, {
                        headers: {
                            Authorization: `Bearer ${storedToken}`
                        }
                    })
                    .then(async response => {
                        setLoading(false)
                        setUser({...response.data.data})
                    })
                    .catch(() => {
                        clearLocalUserData()
                        setUser(null)
                        setLoading(false)
                        if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
                            router.replace('/login')
                        }
                    })
            } else {
                setLoading(false)
            }
        }

        initAuth()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
        loginAuth({email: params.email, password: params.password})
            .then(async response => {
                window.localStorage.setItem(authConfig.storageTokenKeyName, response.accessToken)
                const returnUrl = router.query.returnUrl
                console.log('response', {response})
                setUser({...response.user})
                window.localStorage.setItem('userData', JSON.stringify(response.user))
                const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
                router.replace(redirectURL as string)
            })

            .catch(err => {
                if (errorCallback) errorCallback(err)
            })
    }

    const handleLogout = () => {
        setUser(null)
        window.localStorage.removeItem('userData')
        window.localStorage.removeItem(authConfig.storageTokenKeyName)
        router.push("/")
    }

    const values = {
        user,
        loading,
        setUser,
        setLoading,
        login: handleLogin,
        logout: handleLogout
    }

    return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export {AuthContext, AuthProvider}
