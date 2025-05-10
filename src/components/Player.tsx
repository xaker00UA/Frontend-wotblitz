import { useEffect, useState } from "react";
import { APIRegion, StatsApiFp } from "../api/generated";
import { APIRestUser } from "../api/generated";
import { AxiosError } from "axios";
import PlayerGeneral from "./GeneralStats";
import { Box, Stack } from "@mui/material";
import TableStats from "./TableStats";
import GridTanks from "./GridTanks";
import { transformTankData } from "../helper/TransformType";
import { Timer } from "./Timer";
import { useError } from "../hooks/ErrorContext";
import { useStats } from "../hooks/StatsContext";

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
        const messages = error.response?.data?.detail ?? "detael";
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
      <Stack spacing={10} sx={{ mt: 10, overflow: "hidden" }}>
        <Box
          key={Date.now()}
          sx={{ display: "flex", gap: 10, justifyContent: "center" }}
        >
          <PlayerGeneral
            isLoading={generalLoading}
            account={general?.general.now?.all ?? null}
            name={nickname ?? null}
          />

          <PlayerGeneral
            isLoading={detailsLoading}
            account={details?.general.session?.all ?? null}
            name="SESSION"
          />

          <PlayerGeneral
            isLoading={detailsLoading}
            account={details?.general.update?.all ?? null}
            name="UPDATE"
          />
        </Box>

        {/* Статистика */}

        <TableStats stats={details?.tanks ?? null} />
        <GridTanks tanks={transformTankData(details?.tanks?.now)} />
      </Stack>
    </>
  );
}
