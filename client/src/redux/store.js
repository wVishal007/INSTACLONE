import authSlice from './authSlice.js'
import postSlice from './postSlice.js'
import socketSlice from './socketSlice.js'
import chatSlice from './chatSlice.js'
import RtnSlice from './RTN.js'
import { combineReducers,configureStore } from "@reduxjs/toolkit";


import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}

const rootReducer = combineReducers({
    auth:authSlice,
    post:postSlice,
    socketio:socketSlice,
    chat:chatSlice,
    RealTimeNotifications:RtnSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
   reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})
// const store = configureStore({
//     reducer:{
// auth:authSlice
//     }
// })

export default store;