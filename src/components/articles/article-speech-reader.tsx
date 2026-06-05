"use client";

import { Loader2Icon, PauseIcon, PlayIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { htmlToPlainText } from "@/lib/articles/plain-text";
import { cn } from "@/lib/utils";

type ArticleSpeechReaderProps = {
  title: string;
  contentHtml: string;
  className?: string;
};

function pickSpeechVoice(voices: SpeechSynthesisVoice[]) {
  const preferred = ["uz", "ru", "tr"];
  for (const lang of preferred) {
    const match = voices.find((voice) => voice.lang.toLowerCase().startsWith(lang));
    if (match) return match;
  }
  return voices[0] ?? null;
}

export function ArticleSpeechReader({
  title,
  contentHtml,
  className,
}: ArticleSpeechReaderProps) {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const plainText = useMemo(() => {
    const text = [title, htmlToPlainText(contentHtml)].filter(Boolean).join(". ");
    return text.trim();
  }, [title, contentHtml]);

  const hasText = plainText.length > 0;

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setLoading(false);
    utteranceRef.current = null;
  }, [supported]);

  useEffect(() => stop, [stop]);

  const handleToggle = () => {
    if (!supported || !hasText) return;

    if (speaking) {
      window.speechSynthesis.pause();
      setSpeaking(false);
      return;
    }

    if (window.speechSynthesis.paused && utteranceRef.current) {
      window.speechSynthesis.resume();
      setSpeaking(true);
      return;
    }

    stop();
    setLoading(true);

    const startSpeaking = () => {
      const utterance = new SpeechSynthesisUtterance(plainText);
      const voice = pickSpeechVoice(window.speechSynthesis.getVoices());
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = "uz-UZ";
      }
      utterance.rate = 1;
      utterance.pitch = 1;

      utterance.onstart = () => {
        setLoading(false);
        setSpeaking(true);
      };
      utterance.onend = () => {
        setSpeaking(false);
        utteranceRef.current = null;
      };
      utterance.onerror = () => {
        setSpeaking(false);
        setLoading(false);
        utteranceRef.current = null;
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        startSpeaking();
      };
      return;
    }

    startSpeaking();
  };

  if (!supported) {
    return null;
  }

  return (
    <Button
      type="button"
      size="icon"
      className={cn(
        "size-10 rounded-full bg-nav-active text-nav-active-foreground hover:bg-nav-active-hover hover:text-nav-active-foreground",
        className,
      )}
      aria-label={speaking ? "Ovozli o'qishni to'xtatish" : "Ovozli o'qish"}
      aria-pressed={speaking}
      disabled={!hasText || loading}
      onClick={handleToggle}
    >
      {loading ? (
        <Loader2Icon className="size-4 animate-spin" aria-hidden />
      ) : speaking ? (
        <PauseIcon className="size-4" aria-hidden />
      ) : (
        <PlayIcon className="size-4" aria-hidden />
      )}
    </Button>
  );
}
