import React, { useState } from "react";
import { Table, Button, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { getColor } from "../utils/getColor";
const labelMapping = {
  battles: "Бои",
  winrate: "Победы",
  damage: "Урон",
  accuracy: "Точность",
  survival: "Выживаемость",
};

const generateColumns = (display = false, isClanTable = false) => {
  const styling = (_, index) => {
    if ((index % 3 === 1 || index % 3 === 2) && !display) {
      return { style: { display: "none" } };
    }
    return {};
  };

  const getCellRender = (index) => {
    if (index % 3 === 0) return "Сессия";
    if (index % 3 === 1) return "Апгрейд";
    return "Сейчас";
  };
  const PlayerColumns = [
    {
      title: "Name",
      dataIndex: "name",
      // minWidth: "max-content",
      onCell: (_, index) => ({
        rowSpan: index % 3 === 0 ? 3 : 0,
      }),
      // sorter: (a, b) => a.name.localeCompare(b.name), // Добавлена сортировка
    },
    {
      title: "View",
      minWidth: 50,
      onCell: styling,
      render: (_, record, index) => {
        const viewValue = getCellRender(index);
        record.viewName = viewValue;
        return viewValue;
      },
    },
  ];
  const ClanColumns = [
    {
      title: "Name",
      dataIndex: "nickname",
      minWidth: "max-content",
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.nickname.localeCompare(b.nickname), // Добавлена сортировка
    },
  ];
  const commonColumns = [
    ...Object.entries(labelMapping).map(([key, entity]) => {
      const index = isClanTable ? ["general", "all", key] : ["all", key];

      return {
        title: entity,
        dataIndex: index,
        minWidth: 20,
        onCell: !isClanTable ? styling : null,
        render: (value, record) => {
          const color = getColor(record.viewName, key, value);
          return <span style={{ color }}>{value}</span>;
        },
        sorter: (a, b) => {
          const aValue = index.reduce((acc, field) => acc?.[field], a) || 0;
          const bValue = index.reduce((acc, field) => acc?.[field], b) || 0;
          return aValue - bValue;
        },
      };
    }),
  ];

  if (isClanTable) {
    return [...ClanColumns, ...commonColumns];
  } else {
    return [...PlayerColumns, ...commonColumns];
  }
};

const App = ({ tanks, update, now }) => {
  const [showHiddenRows, setShowHiddenRows] = useState(false);

  const toggleVisibility = () => setShowHiddenRows((prev) => !prev);

  const combinedData = ((tanks, update, now) => {
    let list = [];
    for (let i = 0; i < tanks.length; i++) {
      const tank_id = tanks[i].tank_id;
      const update_obj = update.find((item) => item.tank_id === tank_id);
      const now_obj = now.find((item) => item.tank_id === tank_id);
      list.push(
        { ...tanks[i], key: `tank-${tank_id}-tanks` },
        { ...update_obj, key: `tank-${tank_id}-update` },
        { ...now_obj, key: `tank-${tank_id}-now` }
      );
    }
    return list;
  })(tanks, update, now);

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
      <Button onClick={toggleVisibility}>
        {showHiddenRows ? "Скрыть строки" : "Показать строки"}
      </Button>
    </>
  );
};

export default function TableRow({ session, loading }) {
  if (loading) {
    return <Spin indicator={<LoadingOutlined spin />} size="large" />;
  }

  if (!session?.session?.length || !session?.update?.length) {
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

  const columns = generateColumns(false, true);
  const combinedData = session.members.filter(
    (member) => member.general?.all !== null
  );

  return (
    <Table
      columns={columns}
      dataSource={combinedData}
      pagination={false}
      rowKey={(record) => record.nickname || record.id}
      rowClassName="row-table"
      bordered
      size="small"
      scroll={{ y: 300, x: "100%" }}
    />
  );
};
