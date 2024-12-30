import React, { useState } from "react";
import { Table, Button } from "antd";
// In the fifth row, other columns are merged into first column
// by setting it's colSpan to be 0

const App = ({ tanks, update, now }) => {
  // Состояние для управления видимостью строк
  const [showHiddenRows, setShowHiddenRows] = useState(false);
  const color = (value, params) => {
    const thresholds = {
      fights: [1000, 5000, 20000],
      wins: [50, 60, 70],
      damage: [2400, 2800, 3000],
      accuracy: [80, 85, 90],
      survival: [40, 50, 60],
    };

    const colors = {
      fights: ["grey", "green", "blue", "purple"],
    };
    for (let i = 0; i < thresholds[params].length; i++) {
      if (value < thresholds[params][i]) {
        const col = colors["fights"][i];
        return <span style={{ color: col }}>{value}</span>;
      }
    }
    const col = colors["fights"][3];
    return <span style={{ color: col }}>{value}</span>;
  };

  const styling = (_, index) => {
    if ((index % 3 === 1 || index % 3 === 2) && !showHiddenRows) {
      return { style: { display: "none" } }; // Скрыть вторую и третью строки
    }
    return {};
  };

  // Столбцы таблицы
  const columns = [
    {
      title: "Name",
      dataIndex: "name",

      minWidth: "max-content",
      render: (text) => <a>{text}</a>,
      onCell: (_, index) => {
        if (index % 3 === 0) {
          return { rowSpan: 3 }; // Первая строка Name занимает 3 строки
        }
        return { rowSpan: 0 }; // Для остальных строк пусто
      },
    },
    {
      title: "View",
      dataIndex: "view",
      minWidth: 50,
      onCell: styling,
      render: (text, record, index) => {
        // Задаем значение ячейки в зависимости от индекса
        if (index % 3 === 0) {
          return "Сессия";
        } else if (index % 3 === 1) {
          return "Апргрейд";
        } else {
          return "Сейчас";
        }
      },
    },
    {
      title: "Бои",
      minWidth: 20,
      dataIndex: ["all", "Бои"],
      onCell: styling,
    },
    {
      title: "Победы",
      dataIndex: ["all", "Победы"],
      minWidth: 20,
      onCell: styling,
      render: (value) => color(value, "wins"),
    },
    {
      title: "Урон",
      dataIndex: ["all", "Урон"],
      minWidth: 20,
      onCell: styling,
      render: (value) => color(value, "damage"),
    },
    {
      title: "Точность",
      dataIndex: ["all", "Точность"],
      minWidth: 20,
      onCell: styling,
      render: (value) => color(value, "accuracy"),
    },
    {
      title: "Выживаемость",
      dataIndex: ["all", "Выживаемость"],
      minWidth: 20,
      onCell: styling,
      render: (value) => color(value, "survival"),
    },
  ];

  // Функция для переключения видимости строк
  const toggleVisibility = () => {
    setShowHiddenRows((prev) => !prev); // Переключить видимость
  };
  const alternateArrays = (tanks, update, now) => {
    // Составляем множество ID объектов из tanks и update
    const commonIds = new Set(
      ...[
        tanks.map((item) => item.tank_id), // IDs из tanks
        update.map((item) => item.tank_id), // IDs из update
      ]
    );

    // Фильтруем now, оставляя только объекты с ID из commonIds
    const filteredNow = now.filter((item) => commonIds.has(item.tank_id));

    // Функция для сортировки массива по tank_id
    const sortById = (arr) => arr.sort((a, b) => a.tank_id - b.tank_id);

    // Сортируем все массивы по tank_id
    const sortedTanks = sortById(tanks);
    const sortedUpdate = sortById(update);
    const sortedNow = sortById(filteredNow);

    // Чередуем элементы из каждого массива
    const maxLength = Math.max(
      sortedTanks.length,
      sortedUpdate.length,
      sortedNow.length
    );
    const result = [];

    for (let i = 0; i < maxLength; i++) {
      result.push(sortedTanks[i]);
      result.push(sortedUpdate[i]);
      result.push(sortedNow[i]);
    }

    return result;
  };

  const combinedData = alternateArrays(tanks, update, now).map(
    (item, index) => ({ ...item, key: index })
  );

  return (
    <>
      <Button onClick={toggleVisibility}>
        {showHiddenRows ? "Скрыть строки" : "Показать строки"}
      </Button>
      <Table
        columns={columns}
        dataSource={combinedData}
        pagination={false}
        rowKey="key"
        rowClassName={"row-table"}
        bordered
        size="small"
        Column={{ hidden: true }}
        tableLayout="auto"
        virtual={true}
      />
    </>
  );
};

export default function TableRow({ session }) {
  // Проверяем, существует ли session и update
  if (!session.session || !session.update) {
    return <div>Нет данных</div>; // Возвращаем сообщение, если данных нет
  }

  const { tanks } = session.session; // Извлекаем данные из session
  const { tanks: updateTanks } = session.update; // Извлекаем данные из update
  const { tanks: now } = session.now; // Извлекаем данные из update
  if (tanks.length === 0) {
    return;
  }

  return (
    <>
      <App tanks={tanks} update={updateTanks} now={now} />
    </>
  );
}
