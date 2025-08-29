'use client';
import React from "react";

type ErrorDisplayProps = {
  message: string;
  onRetry: () => void;
};

export function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <div className="bg-red-100 text-red-800 p-4 rounded mb-4 flex flex-col items-center">
      <div className="mb-2">{message || "An error occurred."}</div>
      <button
        className="bg-red-500 text-white px-3 py-1 rounded"
        onClick={onRetry}
      >
        Retry
      </button>
    </div>
  );
}