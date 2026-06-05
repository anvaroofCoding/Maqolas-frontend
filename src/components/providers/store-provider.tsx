"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { hydrateAuthFromStorage } from "@/features/auth/slice/auth-slice";
import {
  makeStore,
  setupStoreListeners,
  type AppStore,
} from "@/lib/store";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
    storeRef.current.dispatch(hydrateAuthFromStorage());
    setupStoreListeners(storeRef.current);
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
