import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  TableSortLabel,
  TableContainer,
} from "@mui/material";
import TableFooter from "@mui/material/TableFooter";
import {
  APIBaseStats,
  APIGeneralTanks,
  APIRestClan,
  APIRestStatsTank,
} from "../api/generated";
import { getColor, StatKey } from "../helper/GetColor";
import { useState } from "react";
interface Props {
  stats: APIGeneralTanks | APIRestClan | null;
}

type ColumnData = Pick<
  APIRestStatsTank,
  "battles" | "winrate" | "damage" | "accuracy" | "survival"
> & { name: string };

const columnHeaders: { key: keyof ColumnData; label: string }[] = [
  { key: "name", label: "Имя" },
  { key: "battles", label: "Бои" },
  { key: "winrate", label: "Победа %" },
  { key: "damage", label: "Урон" },
  { key: "accuracy", label: "Точность %" },
  { key: "survival", label: "Выживаемость %" },
];

const isPlayer = (stats: any): stats is APIGeneralTanks => {
  return stats && "session" in stats;
};

const isClan = (stats: any): stats is APIRestClan => {
  return stats && "tag" in stats;
};
export default function TableStats({ stats }: Props) {
  if (stats === null) return null;

  let data = [];

  if (isClan(stats)) {
    if (stats.members.length === 0) return null;

    const memberData = stats.members
      .filter((member) => member.general?.all != null)
      .map((member) => ({
        name: member.nickname,
        ...member.general?.all,
      }));

    data.push(...memberData);
  }

  if (isPlayer(stats)) {
    if (!stats.session || stats.session.length === 0) return null;

    data = stats.session.map((item) => ({
      name: item.name,
      ...item.all,
    }));
  }

  // Состояния для сортировки
  const [sortColumn, setSortColumn] = useState<keyof ColumnData>("battles");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Функция для сортировки
  const handleSort = (column: keyof ColumnData) => {
    const isAsc = sortColumn === column && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortColumn(column);
  };

  // Функция для сортировки данных
  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    if (aValue === bValue) return 0;

    const compareValue =
      typeof aValue === "number" && typeof bValue === "number"
        ? aValue - bValue
        : String(aValue).localeCompare(String(bValue));

    return sortOrder === "asc" ? compareValue : -compareValue;
  });

  return (
    <TableContainer
      sx={{ bgcolor: "background.paper", border: 1, borderColor: "divider" }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {columnHeaders.map((col) => (
              <TableCell key={col.key}>
                <TableSortLabel
                  active={sortColumn === col.key}
                  direction={sortColumn === col.key ? sortOrder : "asc"}
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody sx={{ fontSize: "12px" }}>
          {sortedData.map((row, idx) => (
            <TableRow key={idx}>
              {columnHeaders.map((col) => (
                <TableCell
                  sx={{
                    color: getColor(
                      undefined,
                      col.key as StatKey,
                      Number(row[col.key])
                    ),
                  }}
                  key={col.key}
                >
                  {row[col.key] !== undefined ? String(row[col.key]) : "-"}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        {isClan(stats) ? (
          <TableFooter>
            <TableRow sx={{ color: "gray" }}>
              <TableCell
                component="td"
                sx={{ typography: "body2", color: " grey " }}
                key="general"
              >
                general
              </TableCell>
              {columnHeaders
                .filter((col) => col.key != "name")
                .map((col) => {
                  const key = col.key as keyof APIBaseStats;
                  return (
                    <TableCell
                      component="td"
                      sx={{
                        typography: "body2",
                        color: getColor(
                          undefined,
                          key as StatKey,
                          Number(stats.general[key])
                        ),
                      }}
                      key={key}
                    >
                      {stats.general?.[key] !== undefined
                        ? String(stats.general[key])
                        : "-"}
                    </TableCell>
                  );
                })}
            </TableRow>
          </TableFooter>
        ) : null}
      </Table>
    </TableContainer>
  );
}
