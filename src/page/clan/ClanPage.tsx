import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Stack } from "@mui/material";
import TableStats from "../../components/TableStats";
import { APIRegion, APIRestClan, ClanApiFp } from "../../api/generated";
import { useError } from "../../hooks/ErrorContext";
import { AxiosError } from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateRangePicker } from "../../components/DateChange";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Timer } from "../../components/Timer";

export default function ClanPage() {
  const { region, name } = useParams();
  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);
  const api = ClanApiFp();
  const [data, setData] = useState<APIRestClan | null>(null);
  const [loading, setLoading] = useState(false);

  const addError = useError();
  if (!region || !name) return null;
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const request = await api.getClanSessionRegionClanGet(
          region as APIRegion,
          name
        );
        const response = await request();
        setData(response.data);
      } catch (err) {
        setData(null);
        const error = err as AxiosError<any>;
        const messages = error.response?.data?.detail ?? "";
        addError(messages);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [region, name]);

  useEffect(() => {
    if (!from || !to) return;
    const fetchPeriod = async () => {
      try {
        setLoading(true);
        const request = await api.getPeriodClanRegionClanPeriodGet(
          region as APIRegion,
          name,
          from.getTime() / 1000,
          to.getTime() / 1000
        );
        const data = await request();
        console.log(data.data);
        setData(data.data);
      } catch (err) {
        const error = err as AxiosError<any>;
        const messages = error.response?.data?.detail ?? "period error";
        addError(messages);
      } finally {
        setLoading(false);
      }
    };
    fetchPeriod();
  }, [from, to]);
  return (
    <>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="300px"
        >
          <CircularProgress size={60} />
        </Box>
      ) : (
        <Stack spacing={5} sx={{ marginTop: "20px" }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateRangePicker
              from={from}
              to={to}
              onChangeFrom={setFrom}
              onChangeTo={setTo}
            />
          </LocalizationProvider>
          {data?.time && <Timer timeInSeconds={data?.time} />}
          <TableStats stats={data}></TableStats>
        </Stack>
      )}
    </>
  );
}
