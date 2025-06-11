import { useCallback, useEffect, useState } from "react";
import { APIGeneral, APIRegion, StatsApiFp } from "../api/generated";
import { APIRestUser } from "../api/generated";
import { AxiosError } from "axios";
import PlayerGeneral from "./GeneralStats";
import {
  Box,
  Button,
  LinearProgress,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import TableStats from "./TableStats";
import GridTanks from "./GridTanks";
import { transformTankData } from "../helper/TransformType";
import { Timer } from "./Timer";
import { useError } from "../hooks/ErrorContext";
import { useStats } from "../hooks/StatsContext";
import { Medal } from "./MedalComponent";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateRangePicker } from "./DateChange";

type Props = {
  region: string;
  nickname: string;
};

export default function PlayerStack({ region, nickname }: Props) {
  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);
  const [general, setGeneral] = useState<APIRestUser | null>(null);
  const [details, setDetails] = useState<APIRestUser | null>(null);
  const [generalLoading, setGenLoading] = useState<boolean>(true);
  const [detailsLoading, setDetLoading] = useState<boolean>(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [progress, setProgress] = useState(0);

  const { setGeneralData, setDetailsData } = useStats();
  const addError = useError();

  const fetchGeneral = useCallback(async () => {
    setGenLoading(true);
    try {
      const request = await StatsApiFp().getGeneralRegionPlayerGetGeneralGet(
        region as APIRegion,
        nickname
      );
      const data = await request();
      setGeneral(data.data);
      setGeneralData(data.data);
    } catch (err) {
      setGeneral(null);
      const error = err as AxiosError<any>;
      const messages = error.response?.data?.detail ?? "general";
      addError(messages);
    } finally {
      setGenLoading(false);
    }
  }, [region, nickname]);

  const fetchDetails = useCallback(async () => {
    setDetLoading(true);
    try {
      const request = await StatsApiFp().getSessionRegionPlayerGetSessionGet(
        region as APIRegion,
        nickname
      );
      const data = await request();
      setDetails(data.data);
      setDetailsData(data.data);
    } catch (err) {
      setDetails(null);
      const error = err as AxiosError<any>;
      const messages = error.response?.data?.detail ?? "detail";
      addError(messages);
    } finally {
      setDetLoading(false);
    }
  }, [region, nickname]);

  const fetchAll = useCallback(() => {
    fetchGeneral();
    fetchDetails();
  }, [fetchGeneral, fetchDetails]);

  useEffect(() => {
    if (!region || !nickname) return;
    fetchAll();
  }, [region, nickname, fetchAll]);

  useEffect(() => {
    if (!autoRefresh) return;
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 1;
      });
    }, 600);

    const interval = setInterval(() => {
      setProgress(100);
      fetchAll();
    }, 60_000); // 1 минута

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
      setProgress(0);
    };
  }, [autoRefresh]);

  useEffect(() => {
    if (!from || !to) return;
    const fetchPeriod = async () => {
      try {
        const request = await StatsApiFp().getPeriodRegionPlayerPeriodGet(
          region as APIRegion,
          nickname,
          from.getTime() / 1000,
          to.getTime() / 1000
        );
        const data = await request();
        console.log(data.data);
        setDetails(data.data);
        setDetailsData(data.data);
      } catch (err) {
        const error = err as AxiosError<any>;
        const messages = error.response?.data?.detail ?? "period error";
        addError(messages);
      }
    };
    fetchPeriod();
  }, [from, to]);

  return (
    <>
      <Stack spacing={10} sx={{ maxWidth: "100vw", mt: 4, overflow: "hidden" }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateRangePicker
            from={from}
            to={to}
            onChangeFrom={setFrom}
            onChangeTo={setTo}
          />
        </LocalizationProvider>
        <LinearProgress
          style={{ visibility: autoRefresh ? "visible" : "hidden" }}
          variant="determinate"
          value={progress}
        />

        <Box
          sx={{
            mt: 2,
            display: "flex",
            gap: 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button variant="contained" onClick={fetchAll}>
            Обновить
          </Button>
          <Typography component="label">Автообновление</Typography>
          <Switch
            onChange={() => setAutoRefresh((prev) => !prev)}
            checked={autoRefresh}
          />
        </Box>
        <GeneralStats
          detail={details?.general ?? null}
          detailsLoading={detailsLoading}
          generalLoading={generalLoading}
          general={general?.general ?? null}
          nickname={nickname}
        />
        <Medal
          current={general?.medals?.medals}
          session={details?.medals?.medals}
        />
        <TableStats stats={details?.tanks ?? null} />
        <GridTanks tanks={transformTankData(details?.tanks?.now)} />
      </Stack>
    </>
  );
}

interface Stats {
  generalLoading: boolean;
  general: APIGeneral | null;
  detail: APIGeneral | null;
  detailsLoading: boolean;
  nickname: string;
}

const GeneralStats = ({
  generalLoading,
  general,
  detail,
  detailsLoading,
  nickname,
}: Stats) => {
  const [isRating, setRating] = useState(false);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: { xs: 4, md: 10 },
          justifyContent: "center",
          flexDirection: {
            xs: "column", // на телефонах — вертикально
            md: "row", // на десктопах — горизонтально
          },
        }}
      >
        {!isRating ? (
          <>
            <PlayerGeneral
              isLoading={generalLoading}
              account={general?.now?.all ?? null}
              name={nickname ?? null}
            />

            <PlayerGeneral
              isLoading={detailsLoading}
              account={detail?.session?.all ?? null}
              name="SESSION"
            />

            <PlayerGeneral
              isLoading={detailsLoading}
              account={detail?.update?.all ?? null}
              name="UPDATE"
            />
          </>
        ) : (
          <>
            <PlayerGeneral
              isLoading={generalLoading}
              account={general?.now?.rating ?? null}
              name={nickname ?? null}
            />

            <PlayerGeneral
              isLoading={detailsLoading}
              account={detail?.session?.rating ?? null}
              name="SESSION"
            />

            <PlayerGeneral
              isLoading={detailsLoading}
              account={detail?.update?.rating ?? null}
              name="UPDATE"
            />
          </>
        )}
      </Box>
      <Box>
        <Typography component="label">Отобразить рейтинг</Typography>
        <Switch
          onChange={() => setRating((prev) => !prev)}
          checked={isRating}
        />
      </Box>
    </>
  );
};
