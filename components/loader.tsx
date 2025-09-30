import React, { useState, useEffect, useRef } from "react";

export const SmartLoader = ({
  isLoading = false,
  onComplete = null,
  onError = null,
  height = "h-2",
  backgroundColor = "bg-gray-200",
  progressColor = "bg-blue-500",
  errorColor = "bg-red-500",
  successColor = "bg-green-500",
}) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isLoading && status === "idle") {
      setStatus("loading");
      setProgress(0);
    }
  }, [isLoading, status]);

  useEffect(() => {
    if (status === "loading") {
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90;
          const increment = Math.random() * 3 + 1;
          return Math.min(prev + increment, 90);
        });
      }, 300);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status]);

  const complete = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setStatus("success");
    setProgress(100);
    setTimeout(() => {
      setStatus("idle");
      setProgress(0);
    }, 1000);
  };

  const error = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setStatus("error");
    setTimeout(() => {
      setProgress(0);
      setStatus("idle");
    }, 800);
  };

  useEffect(() => {
    if (onComplete) {
      complete();
    }
  }, [onComplete]);

  useEffect(() => {
    if (onError) {
      error();
    }
  }, [onError]);

  const getBarColor = () => {
    if (status === "error") return errorColor;
    if (status === "success") return successColor;
    return progressColor;
  };

  return (
    <div className="w-full">
      <div
        className={`w-full ${backgroundColor} rounded-full overflow-hidden border-2 border-blue-400`}
      >
        <div
          className={`${height} ${getBarColor()} rounded-full transition-all ${
            status === "success"
              ? "duration-500"
              : status === "error"
              ? "duration-300"
              : "duration-200"
          } ease-out`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
