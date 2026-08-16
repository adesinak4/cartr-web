"use client";

import { useEffect } from "react";

export function Toast({
  message,
  variant = "success",
  onDismiss,
}: {
  message: string | null;
  variant?: "success" | "error";
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 rounded-md px-4 py-3 text-sm font-medium text-white shadow-card-lg ${
        variant === "success" ? "bg-dark" : "bg-error"
      }`}
    >
      {message}
    </div>
  );
}
