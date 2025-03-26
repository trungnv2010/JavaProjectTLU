import { TCookie } from '@/types/cookie'

export interface TCookieReducer {
  cookies: TCookie[]
}

export const initialState: TCookieReducer = {
  cookies: []
}

export type TCookieAction =
  | { type: 'GET_ALL'; payload: TCookie[] }
  | { type: 'ADD'; payload: TCookie }
  | { type: 'UPDATE'; payload: TCookie }

const cookieReducer = (state: TCookieReducer, action: TCookieAction) => {
  switch (action.type) {
    case 'GET_ALL':
      return { ...state, cookies: action.payload }
    case 'ADD':
      return { ...state, cookies: [...state.cookies, action.payload] }
    case 'UPDATE':
      return {
        ...state,
        cookies: state.cookies.map((cookie) => (cookie._id === action.payload._id ? action.payload : cookie))
      }
    default:
      return state
  }
}

export default cookieReducer
