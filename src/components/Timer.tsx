import React from "react";
import { Box } from "@mui/material";

interface TimerProps {
  timeInSeconds: number;
  sx?: object;
}

export const Timer: React.FC<TimerProps> = ({ timeInSeconds, sx }) => {
  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const parts: string[] = [];

    if (days > 0) parts.push(`${days}d`);
    if (hours > 0 || days > 0)
      parts.push(hours.toString().padStart(2, "0") + "h");
    if (minutes > 0 || hours > 0 || days > 0)
      parts.push(minutes.toString().padStart(2, "0") + "m");
    parts.push(remainingSeconds.toString().padStart(2, "0") + "s");

    return parts.join(":");
  };

  return <Box sx={{ flex: 1, ...sx }}>{formatTime(timeInSeconds)}</Box>;
};
