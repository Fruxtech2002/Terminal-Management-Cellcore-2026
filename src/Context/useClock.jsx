import { useState, useEffect } from "react";

export function formatTime(timestamp = Date.now(), timeZone = "Africa/Lagos") {
  return new Date(timestamp)
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone,
    })
    .replace(" ", "")
    .toLowerCase();
}

export function useClock(timeZone = "Africa/Lagos") {
  const [time, setTime] = useState(() => formatTime(Date.now(), timeZone));

  useEffect(() => {
    const tick = () => setTime(formatTime(Date.now(), timeZone));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timeZone]);

  return time;
}