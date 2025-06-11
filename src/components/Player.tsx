import { useEffect, useState } from "react";
import { APIGeneral, APIRegion, StatsApiFp } from "../api/generated";
import { APIRestUser } from "../api/generated";
import { AxiosError } from "axios";
import PlayerGeneral from "./GeneralStats";
import { Box, Stack, Switch, Typography } from "@mui/material";
import TableStats from "./TableStats";
import GridTanks from "./GridTanks";
import { transformTankData } from "../helper/TransformType";
import { Timer } from "./Timer";
import { useError } from "../hooks/ErrorContext";
import { useStats } from "../hooks/StatsContext";
import { Medal } from "./MedalComponent";

type Props = {
  region: string;
  nickname: string;
};

export default function PlayerStack({ region, nickname }: Props) {
  const [general, setGeneral] = useState<APIRestUser | null>(null);
  const [details, setDetails] = useState<APIRestUser | null>(null);
  const [generalLoading, setGenLoading] = useState<boolean>(true);
  const [detailsLoading, setDetLoading] = useState<boolean>(true);

  const { setGeneralData, setDetailsData } = useStats();
  const addError = useError();
  useEffect(() => {
    if (!region || !nickname) return;
    const fetchGeneral = async () => {
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
    };

    const fetchDetails = async () => {
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
    };
    fetchDetails();
    fetchGeneral();
  }, [region, nickname]);
  return (
    <>
      <Stack
        spacing={10}
        sx={{ maxWidth: "100vw", mt: 10, overflow: "hidden" }}
      >
        <GeneralStats
          detail={details?.general ?? null}
          detailsLoading={detailsLoading}
          generalLoading={generalLoading}
          general={general?.general ?? null}
          nickname={nickname}
        ></GeneralStats>
        <Medal
          current={general?.medals?.medals}
          session={details?.medals?.medals}
        />
        {/* Статистика */}
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
