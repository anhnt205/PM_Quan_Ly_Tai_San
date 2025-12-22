// quản lý state user

// k cần viết switch/case, clone state thủ công, mutate state trực tiếp
import { createSlice } from "@reduxjs/toolkit";

// khởi tạo giá trị ban đầu
const initialState = {
    user: null,
    loading: false,
    error: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: { // định nghĩa  các action+reducer
        loginStart: (state) => {
            state.loading = true
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload
        },
        loginFailure: (state) => {
            state.loading = false;
            state.error = true
        },
        logout: (state) => {
            state.user = null;
            state.loading = false;
            state.error = false
        }
    }
})

export const { loginStart, loginSuccess, loginFailure, logout } = userSlice.actions
export default userSlice.reducer