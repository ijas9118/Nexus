import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IAuthState {
  _id: string;
  email: string;
  name: string;
  isAuthenticated: boolean;
}

const initialState: IAuthState = {
  _id: "",
  email: "",
  name: "",
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ _id: string; email: string; name: string }>) {
      state._id = action.payload._id;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.isAuthenticated = true;
    },
    logout(state) {
      state._id = "";
      state.email = "";
      state.name = "";
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
