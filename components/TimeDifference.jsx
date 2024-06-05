import React, { useState, useEffect } from 'react';

export default function TimeDifference({ timestamp }) {
  const [timeDifference, setTimeDifference] = useState(getLastActive(timestamp));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeDifference(getLastActive(timestamp));
    }, 60000); // Update every minute

    // return () => clearInterval(interval);
  }, [timestamp]);

  function getLastActive(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 1) {
      return "Just now";
    } else if (minutes < 60) {
      return `${minutes}m ago`;
    } else {
      const hours = Math.floor(minutes / 60);
      return `${hours}h ago`;
    }
  }

  return <>{timeDifference}</>;
}