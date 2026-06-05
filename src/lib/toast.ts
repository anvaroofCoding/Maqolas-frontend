"use client";

import { showToast, type ToastOptions } from "nextjs-toast-notify";

const defaultOptions = {
  duration: 4000,
  progress: false,
  position: "bottom-right",
  transition: "slideInUp",
  icon: "",
  sound: false,
} satisfies ToastOptions;

function notify(
  type: "success" | "error" | "warning" | "info",
  message: string,
  options?: ToastOptions,
) {
  if (typeof window === "undefined") return;

  showToast[type](message, {
    ...defaultOptions,
    ...options,
  });
}

export const toast = {
  success: (message: string, options?: ToastOptions) =>
    notify("success", message, options),
  error: (message: string, options?: ToastOptions) =>
    notify("error", message, options),
  warning: (message: string, options?: ToastOptions) =>
    notify("warning", message, options),
  info: (message: string, options?: ToastOptions) =>
    notify("info", message, options),
};
