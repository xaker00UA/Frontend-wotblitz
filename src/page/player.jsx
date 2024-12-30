import axios from "axios";
import { Component } from "react";
import React from "react";
import { useLocation, useParams } from "react-router-dom";
import "./player.css";
import Header from "../components/header";
import TableRow from "../components/tablerow";
import { Button } from "antd";

const PlayerStatsWrapper = () => {
  const { region, name } = useParams();

  return <PlayerStats region={region} name={name} />;
};

class PlayerStats extends Component {
  constructor(props) {
    super(props); // передаем props в суперконструктор
    const { region, name } = props; // извлекаем данные из props
    this.state = {
      player: { now: undefined, ses: undefined },
      session: { session: undefined, update: undefined, now: undefined },
      region: region,
      name: name,
    };
    this.region = region;
    this.name = name;
  }
  async fetch_request_general() {
    try {
      const response = await axios.get(`/api/${this.region}/${this.name}`);
      if (response.data.success !== "ok") {
        throw new Error("Response server:", response.data);
      } else {
        const { success, ...resp } = response.data;
        const { general, nickname } = resp.player;
        this.setState((prevState) => ({
          player: {
            ...prevState.player, // сохраняем предыдущие значения
            now: PlayerGeneral(general, nickname),
          },
        }));
      }
    } catch (error) {
      console.error(error);
    }
  }
  async fetch_request_session_and_update() {
    try {
      const response = await axios.get(
        `/api/${this.region}/player/get_session?name=${this.name}`
      );
      if (response.data.susses !== "ok") {
        console.log(response.data);
        throw new Error(response.data.message);
      } else {
        const { success, session, update, now } = response.data;

        this.setState({ session: { session, update, now } });
        this.setState((prevState) => ({
          player: {
            ...prevState.player, // сохраняем предыдущие значения
            ses: PlayerGeneral(session.general, "SESSION"),
          },
        }));
      }
    } catch (error) {
      console.error(error.message);
    }
  }
  async fetch_request() {
    this.fetch_request_general();
    this.fetch_request_session_and_update();
  }
  handlerWeebhook = () => {
    const host = window.location.hostname;
    console.log(host);
    window.open(`/${this.region}/player/${this.name}/webhook`);
  };

  componentDidUpdate(prevProps) {
    const { region, name } = this.props;
    if (prevProps.region !== region || prevProps.name !== name) {
      // Если регион или имя изменились, обновляем их в состоянии
      this.region = region;
      this.name = name;

      // И вызываем асинхронный запрос для получения данных
      this.fetch_request();
    }
  }
  componentDidMount() {
    this.fetch_request();
  }
  render() {
    return (
      <>
        <Header />
        <div className="main-flexbox-content">
          {this.state.player.now}
          {this.state.player.ses}
        </div>
        <div className="flex-table-content">
          <Button onClick={this.handlerWeebhook}>Weebhook</Button>

          <TableRow session={this.state.session} />
        </div>
      </>
    );
  }
}

export default PlayerStatsWrapper;

export function PlayerGeneral(account, name) {
  // console.log(account)
  // Универсальная функция для выбора цвета в зависимости от статистики и её значения
  const getColor = (stat, value) => {
    const thresholds = {
      fights: [1000, 5000, 20000],
      wins: [50, 60, 70],
      damage: [2400, 2800, 3000],
      accuracy: [80, 85, 90],
      survival: [40, 50, 60],
    };

    const colors = {
      fights: ["grey", "green", "blue", "purple"],
      wins: ["grey", "green", "blue", "purple"],
      damage: ["grey", "green", "blue", "purple"],
      accuracy: ["grey", "green", "blue", "purple"],
      survival: ["grey", "green", "blue", "purple"],
    };

    const statThresholds = thresholds[stat] || [];
    const statColors = colors[stat] || ["grey"];

    for (let i = 0; i < statThresholds.length; i++) {
      if (value < statThresholds[i]) return statColors[i];
    }
    return statColors[statColors.length - 1];
  };
  if (!account.statistics.all) {
    return;
  }

  const stats = [
    { label: "Бои", value: account.statistics.all["Бои"], stat: "fights" },
    { label: "Победы", value: account.statistics.all["Победы"], stat: "wins" },
    { label: "Урон", value: account.statistics.all["Урон"], stat: "damage" },
    {
      label: "Точность",
      value: account.statistics.all["Точность"],
      stat: "accuracy",
    },
    {
      label: "Выживаемость",
      value: account.statistics.all["Выживаемость"],
      stat: "survival",
    },
    // Добавьте другие показатели сюда, если нужно
  ];
  // console.log(stats)
  return (
    <div className="PlayerGeneral">
      <h2 className="title-name">{name}</h2>
      <div className="overview-item">
        {stats.map((item, index) => (
          <div key={index} className="stat-item">
            <label className="stat-label">{item.label}:</label>
            <h4
              className="stats-value"
              style={{ color: getColor(item.stat, item.value) }}
            >
              {item.value}
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
}
