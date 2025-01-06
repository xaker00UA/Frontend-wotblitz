import { useState, useEffect } from "react";
import React from "react";
import { clan_session } from "../../services/api/clanService";
import { useParams } from "react-router";
import Header from "../../components/header";
import { ClanTableRow } from "../../components/tablerow";
const Clan = () => {
  const { region, name } = useParams();
  const [data, setData] = useState(null);
  const [tag, setTag] = useState(null);
  const [time, setTime] = useState(null);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    const FetchData = async () => {
      const res = await clan_session(region, name);
      setData(res);
      setTag(res.tag);
      setTime(res.time);
      setLoading(false);
    };
    FetchData()
      //sdfasdfasdf
      .catch(console.error);
  }, [region, name]);

  return (
    <>
      <Header />
      <Title loading={isLoading} name={tag} time={time} />
      <ClanTableRow loading={isLoading} session={data} />
    </>
  );
};
export default Clan;
const Title = ({ name, time, loading }) => {
  const [stringTime, setStringTime] = useState(null);

  useEffect(() => {
    if (time === null) return;
    let currentTime = time;
    const timer = setInterval(() => {
      const days = Math.floor(currentTime / (3600 * 24)); // Количество полных дней
      const hours = Math.floor((currentTime % (3600 * 24)) / 3600); // Остаток времени в часах
      const minutes = Math.floor((currentTime % 3600) / 60); // Остаток времени в минутах
      const seconds = currentTime % 60; // Остаток времени в секундах

      setStringTime(
        `${days} дней ${hours} часов ${minutes} минут ${seconds} секунд`
      );
      currentTime++;
    }, 1000); // Обновляем каждую секунду

    // Очищаем таймер, когда компонент размонтируется
    return () => clearInterval(timer);
  }, [time]); // Перезапускаем эффект, если `time` или `loading` изменится

  if (loading) return;

  return (
    <div>
      <h3>{name}</h3>
      <h4>Сессия клан длится {stringTime}</h4>
    </div>
  );
};
