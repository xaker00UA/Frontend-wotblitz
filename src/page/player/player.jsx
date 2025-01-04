import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Spin } from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

import Header from "../../components/header";
import TableRow from "../../components/tablerow";
import { getColor } from "../../utils/getColor";
import "./player.css";
import {
  player_general,
  player_session_and_update,
} from "../../services/api/playerService";

const PlayerStats = () => {
  const { region, name } = useParams();
  const [now, SetNow] = useState(false);
  const [session, SetSession] = useState(false);
  const [update, SetUpdate] = useState(false);
  const [RawData, SetRawData] = useState(null);
  const [error, setError] = useState();
  useEffect(() => {
    const fetchData = async () => {
      const response = await player_general(region, name);
      if (response === null) {
        setError("not found player");
      }
      SetNow(response.now.all);
      const {
        session,
        update: Update,
        tanks,
      } = await player_session_and_update(region, name);
      console.log(Update);
      SetSession(session.all);
      SetUpdate(Update.all);
      SetRawData(tanks);
    };

    fetchData(); // Вызов асинхронной функции
  }, [region, name]); // Зависимости: когда region или name изменяются

  const handlerWebhook = () => {
    window.open(`/${region}/player/${name}/webhook`);
  };
  return (
    <>
      <Header />
      {error ? (
        <PlayerNotFound name={name} />
      ) : (
        <>
          <div className="main-flexbox-content">
            <PlayerGeneral account={now} name={name} />
            <PlayerGeneral account={session} name={"Session"} />
            <PlayerGeneral account={update} name={"Update"} />
          </div>
          <div className="flex-table-content">
            <Button type="primary" onClick={handlerWebhook}>
              Webhook
            </Button>
            {RawData ? (
              <TableRow session={RawData} />
            ) : (
              <TableRow loading={true} />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default PlayerStats;

export function PlayerGeneral({ account, name }) {
  console.log(account);
  if (account === false) {
    return <Spin indicator={<LoadingOutlined spin />} size="large" />;
  }
  if (account === null) {
    return (
      <>
        <div className="PlayerGeneral">
          <h2 className="title-name">{name}</h2>
          <div className="overview-item">Нет данных об изменениях</div>
        </div>
      </>
    );
  }

  const stats = [
    { label: "Бои", value: account.battles, stat: "fights" },
    { label: "Победы", value: account.winrate, stat: "wins" },
    { label: "Урон", value: account.damage, stat: "damage" },
    {
      label: "Точность",
      value: account.accuracy,
      stat: "accuracy",
    },
    {
      label: "Выживаемость",
      value: account.survival,
      stat: "survival",
    },
    // Добавьте другие показатели сюда, если нужно
  ];
  const getArrow = (label, value, color) => {
    const excludedLabels = ["Бои"]; // Исключения для стрелок
    if (name !== "Update" || excludedLabels.includes(label)) return null;

    if (value > 0) return <ArrowUpOutlined style={{ color: color }} />;
    if (value < 0) return <ArrowDownOutlined style={{ color: color }} />;
    return null;
  };

  return (
    <div className="PlayerGeneral">
      <h2 className="title-name">{name}</h2>
      <div className="overview-item">
        {stats.map(({ label, stat, value }, index) => {
          const color = getColor(name, stat, value);
          return (
            <div key={index} className="stat-item">
              <label className="stat-label">
                {label}:{getArrow(label, value, color)}
              </label>
              <h3 className="stats-value" style={{ color }}>
                {value}
              </h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}
const PlayerNotFound = ({ name }) => {
  return (
    <div>
      <h1>Игрок {name} не найден</h1>
    </div>
  );
};
