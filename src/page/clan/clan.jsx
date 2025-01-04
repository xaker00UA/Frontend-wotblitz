import { useState, useEffect } from "react";
import React from "react";
import { clan_session } from "../../services/api/clanService";
import { useParams } from "react-router-dom";
import Header from "../../components/header";
import { ClanTableRow } from "../../components/tablerow";
const Clan = () => {
  const { region, name } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    const FetchData = async () => {
      const res = await clan_session(region, name);
      setData(res);
      setLoading(false);
    };
    FetchData();
  }, [region, name]);

  return (
    <>
      <Header />
      <ClanTableRow loading={isLoading} session={data} />
    </>
  );
};
export default Clan;
