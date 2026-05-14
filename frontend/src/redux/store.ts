// 
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import tabsReducer from './tabsSlice'

// lưu state vào localstorage, reload k mất user
import storage from 'redux-persist/lib/storage'
import persistReducer from 'redux-persist/es/persistReducer'
import persistStore from 'redux-persist/es/persistStore'
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'

const persisConfig = {
    key: 'root', // key trong localstorage
    version: 1,
    storage
}

// gộp các reducer
const rootReducer = combineReducers({
    user: userReducer,
    tabs: tabsReducer
})

// tự động lưu state, restore khi refersh
const persistedReducer = persistReducer(persisConfig, rootReducer)

// store chính 
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore redux-persist actions that contain non-serializable values (functions)
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
})
export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch