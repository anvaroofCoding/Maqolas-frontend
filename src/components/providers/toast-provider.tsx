"use client";

import { useEffect } from "react";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void import("nextjs-toast-notify");
  }, []);

  return children;
}
