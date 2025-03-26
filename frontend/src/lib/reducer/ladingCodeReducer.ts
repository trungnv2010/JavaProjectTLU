import { TLadingCode } from '@/types/cookie'

export interface TLadingCodeReducer {
  ladingList: TLadingCode[]
}
export const initialState: TLadingCodeReducer = {
  ladingList: []
}

export type TLadingCodeAction = {
  type: 'GET_ALL'
  payload: TLadingCode[]
}

const ladingCodeReducer = (state: TLadingCodeReducer, action: TLadingCodeAction) => {
  switch (action.type) {
    case 'GET_ALL':
      return { ...state, ladingList: action.payload }
    default:
      return state
  }
}
export default ladingCodeReducer
