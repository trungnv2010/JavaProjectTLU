import { IAuth } from '@/types/auth'

export interface TAuthReducer {
  auth: IAuth
  accessToken: string
}

export const initialState: TAuthReducer = {
  auth: { email: '', fullName: '', _id: '', createdAt: 0 },
  accessToken: ''
}

export type TAuthAction =
  | { type: 'GET_ME'; payload: IAuth }
  | { type: 'LOGIN'; payload: TAuthReducer }
  | { type: 'LOGOUT' }

const authReducer = (state: TAuthReducer, action: TAuthAction) => {
  switch (action.type) {
    case 'GET_ME':
      return { ...state, auth: action.payload }
    case 'LOGIN':
      return action.payload
    case 'LOGOUT':
      return initialState
    default:
      return state
  }
}

export default authReducer
