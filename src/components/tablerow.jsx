import React, { useState } from "react";
import { Table, Button, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { getColor } from "../utils/getColor";

const labelMapping = {
  battles: "fights",
  winrate: "wins",
  damage: "damage",
  accuracy: "accuracy",
  survival: "survival",
};
const alternateArrays = (tanks, update, now) => {
  const commonIds = new Set([...tanks.map((item) => item.tank_id)]);

  const sortById = (arr) =>
    arr
      .filter((item) => commonIds.has(item.tank_id))
      .sort((a, b) => a.tank_id - b.tank_id);

  const sortedTanks = sortById(tanks);
  const sortedUpdate = sortById(update);
  const sortedNow = sortById(now);

  const maxLength = Math.max(
    sortedTanks.length,
    sortedUpdate.length,
    sortedNow.length
  );

  return Array.from({ length: maxLength }).flatMap((_, i) => [
    sortedTanks[i],
    sortedUpdate[i],
    sortedNow[i],
  ]);
};

// Вспомогательная функция: Генерация колонок для таблицы
const generateColumns = (display = false) => {
  // Функция для стилей ячеек
  const styling = (_, index) => {
    if ((index % 3 === 1 || index % 3 === 2) && !display) {
      return { style: { display: "none" } }; // Возвращаем стиль для скрытия
    }
    return {}; // Возвращаем пустой стиль, если условие не выполнено
  };
  const getCellRender = (index) => {
    if (index % 3 === 0) return "Сессия";
    if (index % 3 === 1) return "Апгрейд";
    return "Сейчас";
  };

  return [
    {
      title: "Name",
      dataIndex: "name",
      minWidth: "max-content",
      render: (text) => <a>{text}</a>,
      onCell: (_, index) => ({
        rowSpan: index % 3 === 0 ? 3 : 0, // Объединение строк
      }),
    },
    {
      title: "View",
      minWidth: 50,
      onCell: styling,
      render: (_, record, index) => {
        // Сохраняем текущее значение View в записи
        const viewValue = getCellRender(index);
        record.viewName = viewValue; // Сохраняем значение для других колонок
        return viewValue;
      },
    },
    ...Object.entries(labelMapping).map(([key, entity]) => ({
      title: key,
      dataIndex: ["all", key],
      minWidth: 20,
      onCell: styling,
      render: (value, record) => {
        const color = getColor(record.viewName, entity, value); // Получаем цвет на основе данных
        return <span style={{ color: color }}>{value}</span>;
      },
    })),
  ];
};

// Основной компонент App
const App = ({ tanks, update, now }) => {
  const [showHiddenRows, setShowHiddenRows] = useState(false);

  // Переключение видимости строк
  const toggleVisibility = () => setShowHiddenRows((prev) => !prev);

  // Получение комбинированных данных
  const combinedData = alternateArrays(tanks, update, now).map(
    (item, index) => {
      return { ...item, key: index };
    }
  );

  // Генерация колонок
  const columns = generateColumns(showHiddenRows);

  return (
    <>
      <Table
        columns={columns}
        dataSource={combinedData}
        pagination={false}
        rowKey="key"
        rowClassName="row-table"
        bordered
        size="small"
        scroll={{ y: 300, x: "100%" }}
      />
      <Button color="default" variant="dashed" onClick={toggleVisibility}>
        {showHiddenRows ? "Скрыть строки" : "Показать строки"}
      </Button>
    </>
  );
};

// Компонент-обёртка
export default function TableRow({ session, loading }) {
  if (loading) {
    return <Spin indicator={<LoadingOutlined spin />} size="large" />;
  }
  console.log(session);
  if (!session.session.length || !session.update.length) {
    return <div>Нет данных</div>;
  }

  const tanks = session.session;
  const updateTanks = session.update;
  const now = session.now;

  return <App tanks={tanks} update={updateTanks} now={now} />;
}
export const ClanTableRow = ({ session, loading }) => {
  if (loading) {
    return <Spin indicator={<LoadingOutlined spin />} size="large" />;
  }

  if (!session?.members?.length) {
    return <div>Нет данных</div>;
  }
  const columns = [
    { title: "Name", dataIndex: "nickname", minWidth: "max-content" },
    ...Object.entries(labelMapping).map(([key, entity]) => ({
      title: key,
      dataIndex: ["general", "all", key],
      minWidth: 20,
      render: (value) => {
        const color = getColor("Session", entity, value); // Получаем цвет на основе данных
        return <span style={{ color: color }}>{value}</span>;
      },
    })),
  ];
  const combinedData = session.members.filter(
    (member) => member.general.all !== null
  );
  return (
    <Table
      columns={columns}
      dataSource={combinedData}
      pagination={false}
      rowKey="account_id"
      rowClassName="row-table"
      bordered
      size="small"
      scroll={{ y: 300, x: "100%" }}
    />
  );
};
