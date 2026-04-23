import { useEffect, useState } from "react";

export const formatTime = (seconds: number) => {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');

  return `${hrs}:${mins}:${secs}`;
};

export const useCountdown = (initialCount: number, onComplete?: () => void) => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    if (count <= 0) {
      if (onComplete) onComplete();
      return;
    }

    const timer = setInterval(() => {
      setCount(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer); 
  }, [count]);

  return count;
};