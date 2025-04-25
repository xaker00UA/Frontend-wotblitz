import React, { useEffect } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Divider,
  Paper,
} from "@mui/material";
import { APIRestStatsTank } from "../api/generated";
import { getColor, StatKey } from "../helper/GetColor";
import StraightIcon from "@mui/icons-material/Straight";
import { useError } from "../hooks/ErrorContext";

interface PlayerGeneralProps {
  isLoading: boolean;
  account: APIRestStatsTank | null;
  name: string | null;
}

const PlayerGeneral: React.FC<PlayerGeneralProps> = ({
  isLoading,
  account,
  name,
}) => {
  const addError = useError();
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!account || !name || account.battles === 0) {
    useEffect(() => {
      console.log("useEfferct");
      addError("Сыграйте один бой в рандоме чтобы увидеть результат");
    }, [account]);

    return null;
  }

  const stats: { label: string; value: number; stat: StatKey }[] = [
    { label: "Бои", value: account.battles, stat: "battles" },
    { label: "Победы", value: account.winrate, stat: "winrate" },
    { label: "Урон", value: account.damage, stat: "damage" },
    { label: "Точность", value: account.accuracy, stat: "accuracy" },
    { label: "Выживаемость", value: account.survival, stat: "survival" },
    // Добавь другие показатели, если нужно
  ];

  const getArrow = (label: string, value: number) => {
    const excludedLabels = ["Бои"]; // Исключения для стрелок
    if (name !== "UPDATE" || excludedLabels.includes(label)) return null;

    if (value > 0)
      return <StraightIcon fontSize="small" style={{ color: "green" }} />;
    if (value < 0)
      return (
        <StraightIcon
          fontSize="small"
          style={{ transform: "rotate(180deg)" }}
          sx={{ color: "red" }}
        />
      );
    return null;
  };

  return (
    <Paper sx={{ flex: 1 }} elevation={10}>
      <Box p={5}>
        <Typography align="center" variant="h4">
          {name}
        </Typography>
        <Divider />
        <Box>
          {stats.map(({ label, stat, value }, index) => {
            const col = getColor(name, stat, value);
            return (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                gap="10px"
                justifyContent="space-between"
                mb={1}
              >
                <Typography align="center" variant="body1" sx={{ mr: 1 }}>
                  <Box
                    component="span"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {label}:{getArrow(label, value)}
                  </Box>
                </Typography>
                <Typography variant="h5" sx={{ color: col }}>
                  {value}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
};

export default PlayerGeneral;
