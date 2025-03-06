"use client";

import { useEffect, useState } from "react";
import IceImage from "./ice-image";
import { CheckCircle } from "lucide-react";

interface StudyTimerProps {
  isActive: boolean;
  totalMinutes: number;
  onTimeUpdate?: (minutes: number) => void;
  size?: number;
}

export default function StudyTimer({
  isActive,
  totalMinutes,
  onTimeUpdate,
  size = 200,
}: StudyTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(totalMinutes);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Reset timer when not active
    if (!isActive) {
      if (timeRemaining <= 0) {
        setIsCompleted(true);
      }
      return;
    }

    // Initialize timer when starting
    if (isActive && timeRemaining === totalMinutes) {
      setIsCompleted(false);
    }

    // Set up the countdown interval
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = Math.max(0, prev - 1 / 60); // Decrease by 1 second (1/60 of a minute)

        if (newTime <= 0) {
          clearInterval(interval);
          setIsCompleted(true);
        }

        return newTime;
      });
    }, 1000);

    // Clean up interval on unmount or when isActive changes
    return () => clearInterval(interval);
  }, [isActive, totalMinutes]);

  // Reset timer when totalMinutes changes and not active
  useEffect(() => {
    if (!isActive) {
      setTimeRemaining(totalMinutes);
      setIsCompleted(false);
    }
  }, [totalMinutes, isActive]);

  // Use a separate effect for the callback to avoid render-phase updates
  useEffect(() => {
    if (onTimeUpdate) {
      onTimeUpdate(timeRemaining);
    }
  }, [timeRemaining, onTimeUpdate]);

  // Calculate opacity based on time remaining
  const opacity = timeRemaining / totalMinutes;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {isCompleted ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-green-100 rounded-full w-full h-full flex items-center justify-center animate-pulse">
              <CheckCircle className="w-1/2 h-1/2 text-green-500" />
            </div>
          </div>
        ) : (
          <IceImage opacity={opacity} size={size} />
        )}

        {/* 完了時のエフェクト */}
        {isCompleted && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-full h-full">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-green-400 rounded-full"
                  style={{
                    top: `${50 + 40 * Math.sin((i * Math.PI) / 4)}%`,
                    left: `${50 + 40 * Math.cos((i * Math.PI) / 4)}%`,
                    animation: `pulse 1.5s infinite ${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {isActive && !isCompleted && (
        <div className="mt-2 text-center">
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-full px-3 py-1 text-sm font-medium">
            {Math.floor(timeRemaining)}:
            {String(Math.floor((timeRemaining % 1) * 60)).padStart(2, "0")}
          </div>
        </div>
      )}

      {isCompleted && !isActive && (
        <div className="mt-2 text-center">
          <div className="bg-green-100 dark:bg-green-900/30 rounded-full px-3 py-1 text-sm font-medium text-green-700 dark:text-green-400">
            勉強完了！
          </div>
        </div>
      )}
    </div>
  );
}
