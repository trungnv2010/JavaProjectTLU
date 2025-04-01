// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import user from 'src/stores/apps/user'
import auth from 'src/stores/apps/auth'
import category from "src/stores/apps/category";
import product from "src/stores/apps/product";
import order from "src/stores/apps/order";
import review from "src/stores/apps/review";

export const store = configureStore({
  reducer: {
    user,
    auth,
    category,
    product,
    order,
    review
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
