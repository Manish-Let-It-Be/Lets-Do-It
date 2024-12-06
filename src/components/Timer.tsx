import { useEffect, useState } from "react";

interface TimerProps {
  startTime: Date;
  isRunning: boolean;
  previousTime?: number;
}

export function Timer({ startTime, isRunning, previousTime = 0 }: TimerProps) {
  const [elapsed, setElapsed] = useState<string>("0:00");
  const [totalMs, setTotalMs] = useState<number>(previousTime);

  useEffect(() => {
    let intervalId: number;

    if (isRunning) {
      intervalId = window.setInterval(() => {
        const now = new Date();
        const currentElapsed = now.getTime() - startTime.getTime();
        const totalElapsed = currentElapsed + previousTime;
        const minutes = Math.floor(totalElapsed / 60000);
        const seconds = Math.floor((totalElapsed % 60000) / 1000);
        setElapsed(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        setTotalMs(totalElapsed);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [startTime, isRunning, previousTime]);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900 rounded-md">
      <span className="text-xs text-blue-600 dark:text-blue-300 font-medium">Time:</span>
      <span className="text-sm font-mono text-blue-700 dark:text-blue-200">{elapsed}</span>
    </div>
  );
}