import { Box } from "@mui/material";
import { display } from "@mui/system";
import React, { useState, useEffect } from "react";

interface TimerProps {
  timeInSeconds: number;
  sx?: object;
}

export const Timer: React.FC<TimerProps> = ({ timeInSeconds, sx }) => {
  const [time, setTime] = useState(timeInSeconds);

  // Функция для преобразования секунд в формат "дни:часы:минуты:секунды"
  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / (3600 * 24)); // Количество дней
    const hours = Math.floor((seconds % (3600 * 24)) / 3600); // Часы
    const minutes = Math.floor((seconds % 3600) / 60); // Минуты
    const remainingSeconds = seconds % 60; // Секунды

    return `${days.toString().padStart(2, "0")}d:${hours
      .toString()
      .padStart(2, "0")}h:${minutes
      .toString()
      .padStart(2, "0")}m:${remainingSeconds.toString().padStart(2, "0")}s`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime + 1); // Увеличиваем время каждую секунду
    }, 1000);

    return () => clearInterval(interval); // Очищаем интервал при размонтировании компонента
  }, []);

  return <Box sx={{ flex: 1, ...sx }}>Сессия длится: {formatTime(time)}</Box>;
};
