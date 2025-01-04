import React, { useState, Component, useRef, useEffect } from "react";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
import { player_search } from "../services/api/playerService";

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
        setData([
          { label: newValue, value: newValue, region: reg.value },
          ...data,
        ]); // Обновляем данные в state
      }
    }, 1000); // Задержка 1 секунда для поиска
  };

  // Обработчик для выбора значения
  const handleChange = (value, option) => {
    const { region } = option;
    setData([]); // Очищаем данные
    navigate(`/${region}/player/${value}`); // Переходим по URL
  };

  return (
    <>
      <Select
        showSearch
        autoClearSearchValue={true}
        placeholder={"Введите ник"}
        defaultActiveFirstOption={true}
        filterOption={true}
        onSearch={handleSearch} // Поиск по введенному значению
        onChange={handleChange} // Обработчик при изменении
        notFoundContent="Игрок не найден"
        options={data}
        allowClear={false}
        loading={false}
      />
      <Select_Region setRegion={setRegion} region={reg} />
    </>
  );
};

export default Search;
