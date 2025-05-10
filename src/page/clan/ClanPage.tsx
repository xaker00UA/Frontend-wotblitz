import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Stack } from "@mui/material";
import TableStats from "../../components/TableStats";
import { APIRegion, APIRestClan, ClanApiFp } from "../../api/generated";
import { useError } from "../../hooks/ErrorContext";
import { AxiosError } from "axios";

export default function ClanPage() {
  const { region, name } = useParams();
  const api = ClanApiFp();
  const [data, setData] = useState<APIRestClan | null>(null);

  const addError = useError();
  if (!region || !name) return null;
  useEffect(() => {
    const fetchData = async () => {
      try {
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
      }
    };
    fetchData();
  }, [region, name]);

  return (
    <>
      <Stack>
        <TableStats stats={data}></TableStats>
      </Stack>
    </>
  );
}
