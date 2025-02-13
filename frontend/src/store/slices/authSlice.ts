import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

// User Interface
interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "mentor" | "admin";
}

// Authentication State
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  status: "idle",
};

// 🔹 Thunk to refresh access token
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post(
        "/auth/refresh-token",
        {},
        { withCredentials: true }
      );
      const { accessToken, user } = response.data;

      // Store new token in Redux state
      dispatch(setCredentials({ user, accessToken }));
      return accessToken;
    } catch (error: any) {
      dispatch(clearUser()); // Logout user if refresh fails
      return rejectWithValue("Session expired, please log in again.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    clearUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshAccessToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload;
        state.status = "succeeded";
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.status = "failed";
      });
  },
});

export const { setCredentials, updateToken, clearUser } = authSlice.actions;
export default authSlice.reducer;
