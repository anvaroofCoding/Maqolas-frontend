import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import "@/features/admin/api/admin-api";
import "@/features/banners/api/banners-api";
import "@/features/article-requests/api/article-requests-api";
import "@/features/articles/api/articles-api";
import "@/features/categories/api/categories-api";
import "@/features/users/api/users-api";
import "@/features/pins/api/pins-api";
import { authApi } from "@/features/auth/api/auth-api";
import { authReducer } from "@/features/auth/slice/auth-slice";
import { baseApi } from "@/lib/store/api/base-api";

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      [baseApi.reducerPath]: baseApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware, authApi.middleware),
    devTools: process.env.NODE_ENV !== "production",
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export function setupStoreListeners(store: AppStore) {
  setupListeners(store.dispatch);
}
