import { useState, useEffect } from "react";
import { ClanApiFp, APIClanTop } from "../../api/generated";
import TopClanList from "../../components/TopListClans";
import { Box, CircularProgress } from "@mui/material";

export default function TopClanPage() {
  const api = ClanApiFp();

  const [data, setData] = useState<APIClanTop[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(10);
  const [startDay, setDay] = useState<number>(
    Math.floor(Date.now() / 1000 - 60 * 60 * 24 * 7)
  );

  const request = async () => {
    try {
      const request = await api.topClanListTopClanGet(
        Math.floor(Date.now() / 1000),
        startDay,
        limit
      );
      return (await request()).data;
    } catch {
      return null;
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const responses = await request();
    setData(responses);
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, [startDay, limit]);

  return (
    <Box>
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
        <TopClanList data={data} />
      )}
    </Box>
  );
}
