import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser, BanInfo } from "@/features/auth/types";

const ACCESS_TOKEN_KEY = "maqolas_access_token";
const REFRESH_TOKEN_KEY = "maqolas_refresh_token";

function readStoredToken(key: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  ban: BanInfo | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  ban: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAuthFromStorage(state) {
      const accessToken = readStoredToken(ACCESS_TOKEN_KEY);
      const refreshToken = readStoredToken(REFRESH_TOKEN_KEY);
      if (!accessToken) return;

      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
    },
    setSessionTokens(
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>,
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;

      if (typeof window !== "undefined") {
        localStorage.setItem(ACCESS_TOKEN_KEY, action.payload.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, action.payload.refreshToken);
      }
    },
    setCredentials(
      state,
      action: PayloadAction<{
        user: AuthUser;
        accessToken: string;
        refreshToken: string;
      }>,
    ) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;

      if (typeof window !== "undefined") {
        localStorage.setItem(ACCESS_TOKEN_KEY, action.payload.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, action.payload.refreshToken);
      }
    },
    clearCredentials(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.ban = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      }
    },
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setBan(state, action: PayloadAction<BanInfo>) {
      state.ban = action.payload;
    },
    clearBan(state) {
      state.ban = null;
    },
  },
});

export const {
  hydrateAuthFromStorage,
  setSessionTokens,
  setCredentials,
  clearCredentials,
  setUser,
  setBan,
  clearBan,
} = authSlice.actions;
export const authReducer = authSlice.reducer;

export function getAccessToken() {
  return readStoredToken(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return readStoredToken(REFRESH_TOKEN_KEY);
}
