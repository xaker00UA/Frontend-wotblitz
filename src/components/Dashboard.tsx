import { useEffect, useState } from "react";
import { APICombatStats, PlayerApiFp } from "../api/generated";
import {
  Button,
  Box,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

interface Props {
  player_id: number;
  start_day: number;
  end_day: number;
}

const metricOptions = {
  damage: "Урон",
  wins: "Победы",
  survival: "Выживаемость",
  battles: "Бои",
  accuracy: "Точность",
};

function DashBoardPlayer({ player_id, start_day, end_day }: Props) {
  console.log(player_id, start_day, end_day);
  const api = PlayerApiFp();
  const [data, setData] = useState<APICombatStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [selectedMetric, setSelectedMetric] =
    useState<keyof typeof metricOptions>("damage");

  const fetchData = async () => {
    setLoading(true);
    try {
      const request = await api.getDashboardPeriodDashboardPeriodGet(
        player_id,
        start_day,
        end_day
      );
      const response = await request();
      setData(response.data);
      if (!showChart) {
        setShowChart(true);
      }
    } catch (e) {
      console.error(e);
      setData(null); // Clear data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showChart) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start_day, end_day, player_id]);

  const handleButtonClick = () => {
    if (showChart) {
      setShowChart(false);
    } else {
      fetchData();
    }
  };
  function buildDataset(
    data: APICombatStats | null,
    selectedMetric: keyof typeof metricOptions
  ) {
    if (!data) return [];
    return data.timestamp
      .map((t, i) => ({
        date: new Date(t * 1000),
        value: data[selectedMetric][i],
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }
  const dataset = buildDataset(data ?? null, selectedMetric);

  const chartData = {
    xAxis: [
      {
        data: dataset.map((d) => d.date),
        scaleType: "time" as const,
        label: "Дата",
      },
    ],
    series: [
      {
        data: dataset.map((d) => d.value),
        label: metricOptions[selectedMetric], // например: "Урон"
      },
    ],
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Button
          variant="contained"
          onClick={handleButtonClick}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : showChart ? (
            "Скрыть график"
          ) : (
            "Показать график"
          )}
        </Button>
        {showChart && (
          <FormControl size="small">
            <InputLabel>Показатель</InputLabel>
            <Select
              value={selectedMetric}
              label="Показатель"
              onChange={(e) =>
                setSelectedMetric(e.target.value as keyof typeof metricOptions)
              }
            >
              {Object.entries(metricOptions).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>
      {showChart && chartData && data && data.timestamp.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <LineChart
            xAxis={chartData.xAxis}
            series={chartData.series}
            height={400}
          />
        </Box>
      )}
    </Box>
  );
}

export default DashBoardPlayer;
