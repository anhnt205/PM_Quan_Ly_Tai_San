// 
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'

// lưu state vào localstorage, reload k mất user
import storage from 'redux-persist/lib/storage'
import persistReducer from 'redux-persist/es/persistReducer'
import persistStore from 'redux-persist/es/persistStore'

const persisConfig = {
    key: 'root', // key trong localstorage
    version: 1,
    storage
}

// gộp các reducer
const rootReducer = combineReducers({
    user: userReducer
})

// tự động lưu state, restore khi refersh
const persistedReducer = persistReducer(persisConfig, rootReducer)

// store chính 
export const store = configureStore({
    reducer: persistedReducer
})
export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch