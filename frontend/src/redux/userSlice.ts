import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of the user slice state
interface UserState {
  user: any | null; // can be refined to a proper user type if available
  loading: boolean;
  error: boolean;
}

// khởi tạo giá trị ban đầu
const initialState = {
  user: null as any,
  loading: false,
  error: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // định nghĩa  các action+reducer
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.user = action.payload;
    },
    loginFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = false;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  userSlice.actions;
export default userSlice.reducer;
