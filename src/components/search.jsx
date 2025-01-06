import React, { useState, Component, useRef, useEffect } from "react";
import { Select } from "antd";
import { useNavigate } from "react-router";
import { player_search } from "../services/api/playerService";
import { clan_search } from "../services/api/clanService";
const Select_Region = ({ setRegion, region }) => {
  const data = [
    { label: "EU", value: "eu" },
    { label: "NA", value: "com" },
    { label: "ASIA", value: "asia" },
  ];
  useEffect(() => {
    if (!region) {
      setRegion(data[0]);
    }
  }, data);
  return (
    <>
      <Select
        value={region}
        options={data}
        onChange={(_, value) => setRegion(value)}
        style={{ width: "80px" }}
      ></Select>
    </>
  );
};
const Search = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const timeout = useRef(null); // Ссылка на таймер
  const [reg, setRegion] = useState(null);

  const handleSearch = async (newValue) => {
    // Сбрасываем старый таймер, если новый ввод
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    // Устанавливаем новый таймер
    timeout.current = setTimeout(async () => {
      if (newValue) {
        const data = await player_search(newValue); // Запрос к серверу
        const clans = await clan_search(newValue);
        setData([
          {
            label: <span>player</span>,
            title: "player",
            options: [
              {
                label: newValue,
                player: true,
                value: newValue,
                region: reg.value,
                key: "one-player-" + newValue,
              },
              ...data,
            ],
          },
          {
            label: <span>clan</span>,
            title: "clan",
            options: [
              {
                label: newValue,
                player: false,
                value: newValue.toUpperCase(),
                region: reg.value,
                key: "one-clan-" + newValue,
              },
              ...clans,
            ],
          },
        ]); // Обновляем данные в state
      }
    }, 500);
  };

  // Обработчик для выбора значения
  const handleChange = (value, option) => {
    const { player } = option;
    const { region } = option;
    setData([]); // Очищаем данные
    if (player) {
      navigate(`/${region}/player/${value}`); // Переходим по URL
    } else {
      navigate(`/${region}/clan/${value}`); // Переходим по URL
    }
  };
  return (
    <>
      <Select
        showSearch
        autoClearSearchValue={false}
        placeholder={"Введите ник или название клана"}
        defaultActiveFirstOption={true}
        filterOption={false}
        onSearch={handleSearch} // Поиск по введенному значению
        onChange={handleChange} // Обработчик при изменении
        notFoundContent="Игрок не найден"
        allowClear={false}
        loading={false}
        options={data}
      ></Select>
      <Select_Region setRegion={setRegion} region={reg} />
    </>
  );
};

export default Search;
