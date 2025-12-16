import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  isAuthenticated: boolean;
  userName: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userName: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<{ userName: string }>) => {
      state.isAuthenticated = true;
      state.userName = action.payload.userName;
    },
    signOut: (state) => {
      state.isAuthenticated = false;
      state.userName = null;
    },
  },
});

export const { signIn, signOut } = authSlice.actions;
export default authSlice.reducer;
