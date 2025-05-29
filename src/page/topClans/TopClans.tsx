import { useState, useEffect } from "react";
import { ClanApiFp, APIClanTop } from "../../api/generated";
import TopClanList from "../../components/TopListClans";
import { Box } from "@mui/material";

export default function TopClanPage() {
  const api = ClanApiFp();

  const [data, setData] = useState<APIClanTop[] | null>(null);

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
    const responses = await request();
    setData(responses);
  };
  useEffect(() => {
    fetchData();
  }, [startDay, limit]);

  return (
    <Box sx={{ width: "100%" }}>
      <TopClanList data={data} />
    </Box>
  );
}
