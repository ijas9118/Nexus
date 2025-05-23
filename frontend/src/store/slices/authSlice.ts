import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";
import { UserInterface } from "@/types/user";

// Authentication State
interface AuthState {
  isAuthenticated: boolean;
  user: UserInterface | null;
  accessToken: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const storedAccessToken = localStorage.getItem("accessToken");

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: storedAccessToken,
  status: "idle",
};

// Thunk to refresh access token
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/auth/refresh-token",
        {},
        { withCredentials: true },
      );
      return response.data;
    } catch {
      return rejectWithValue("Session expired, please log in again.");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: UserInterface; accessToken: string }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      localStorage.setItem("sessionActive", "true");
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },
    clearUser: (state) => {
      console.log(state);
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      localStorage.setItem("sessionActive", "false");
    },
    updateUserProfile: (
      state,
      action: PayloadAction<Partial<UserInterface>>,
    ) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshAccessToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        authSlice.caseReducers.setCredentials(state, action);
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

export const { setCredentials, updateToken, clearUser, updateUserProfile } =
  authSlice.actions;
export default authSlice.reducer;
