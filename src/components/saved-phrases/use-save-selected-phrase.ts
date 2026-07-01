"use client";

import { useCallback, useState } from "react";
import { useCreateSavedPhraseMutation } from "@/features/saved-phrases/api/saved-phrases-api";
import { toast } from "@/lib/toast";

function getErrorMessage(error: unknown, fallback: string) {
  if (
    error &&
    typeof error === "object" &&
    "data" in error &&
    error.data &&
    typeof error.data === "object" &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message;
  }

  return fallback;
}

export function useSaveSelectedPhrase() {
  const [showTick, setShowTick] = useState(false);
  const [createPhrase, { isLoading }] = useCreateSavedPhraseMutation();

  const dismissTick = useCallback(() => {
    setShowTick(false);
  }, []);

  const savePhrase = useCallback(
    async (articleId: string, text: string) => {
      const trimmed = text.trim();
      if (trimmed.length < 2) return false;

      try {
        await createPhrase({ articleId, text: trimmed }).unwrap();
        window.getSelection()?.removeAllRanges();
        setShowTick(true);
        return true;
      } catch (error) {
        const message = getErrorMessage(error, "Ibora saqlanmadi");
        if (message.includes("allaqachon")) {
          toast.info(message);
        } else {
          toast.error(message);
        }
        return false;
      }
    },
    [createPhrase],
  );

  return {
    savePhrase,
    isSaving: isLoading,
    showTick,
    dismissTick,
  };
}
