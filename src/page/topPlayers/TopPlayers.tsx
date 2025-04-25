import { useState, useEffect } from "react";
import { PlayerApiFp, APIParameter } from "../../api/generated";
import TopListPlayers from "../../components/TopListPlayers";

export default function Players() {
  const api = PlayerApiFp();

  const [data, setData] = useState<string[] | null[]>([null, null, null]);

  const [limit, setLimit] = useState<number>(10);
  const [startDay, setDay] = useState<number>(
    Date.now() / 1000 - 60 * 60 * 24 * 7
  );

  const parameters: APIParameter[] = [
    APIParameter.Battles,
    APIParameter.Wins,
    APIParameter.Damage,
  ];

  const request = async (parameter: APIParameter) => {
    try {
      return await api.topPlayersTopPlayersGet(limit, parameter, startDay);
    } catch {
      return null;
    }
  };

  const fetchData = async () => {
    const responses = await Promise.all(
      parameters.map((item) => request(item))
    );
    setData(responses);
  };

  return <TopListPlayers battles={data[0]} wins={data[1]} damage={data[2]} />;
}
