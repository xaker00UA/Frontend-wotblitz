import { useState, useEffect } from "react";
import { PlayerApiFp, APIParameter, APITopPlayer } from "../../api/generated";
import TopListPlayers from "../../components/TopListPlayers";
import { Box, CircularProgress } from "@mui/material";

export default function TopPlayersPage() {
  const api = PlayerApiFp();

  const [data, setData] = useState<(APITopPlayer[] | null)[]>([
    null,
    null,
    null,
  ]);

  const [limit, setLimit] = useState<number>(10);
  const [startDay, setDay] = useState<number>(
    Math.floor(Date.now() / 1000 - 60 * 60 * 24 * 7)
  );
  const [loading, setLoading] = useState<boolean>(false);
  const parameters: APIParameter[] = [
    APIParameter.Battles,
    APIParameter.Wins,
    APIParameter.Damage,
  ];

  const request = async (parameter: APIParameter) => {
    try {
      const request = await api.topPlayersTopPlayersGet(
        limit,
        parameter,
        startDay
      );
      return (await request()).data;
    } catch {
      return null;
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const responses = await Promise.all(
      parameters.map((item) => request(item))
    );
    setData(responses);
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, [startDay, limit]);

  return (
    <Box width="100%">
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
        <TopListPlayers battles={data[0]} wins={data[1]} damage={data[2]} />
      )}
    </Box>
  );
}
