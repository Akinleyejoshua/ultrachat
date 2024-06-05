import { useState } from "react";

const useTime = () => {
  const [time, setTime] = useState("");

  const relativeTime = (timestamp) => {
    setInterval(() => {
      const now = Date.now();
      const difference = now - new Date(timestamp).getTime();

      // Calculate time units
      const seconds = Math.floor(Math.abs(difference) / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      // Define thresholds and formatting
      let unit;
      if (seconds < 60) {
        unit = `${seconds}s`;
        setTime(`${unit} ago`);
      } else if (minutes < 60) {
        unit = `${minutes}m`;
        setTime(`${unit} ago`);
      } else if (hours < 24) {
        unit = `${hours}h`;
        setTime(`${unit} ago`);
      } else if (days < 30) {
        unit = `${days}d`;
        setTime(`${unit} ago`);
      } else {
        unit = new Date(timestamp).toLocaleString();
        setTime(`${unit} ago`);
      }

      // Update state with relative time
    }, 1000);
    return time === "" ? "Just now" : time;

  }

  return {
    relativeTime
  }

}

export default useTime;