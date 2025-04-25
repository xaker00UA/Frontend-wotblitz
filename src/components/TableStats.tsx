import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  APIGeneralTanks,
  APIRestClan,
  APIRestStatsTank,
} from "../api/generated";
import { getColor, StatKey } from "../helper/GetColor";
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

    data.push({ name: "general", ...stats.general });

    const memberData = stats.members.map((member) => ({
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

  return (
    <Paper sx={{ border: "1px solid", borderColor: "divider" }}>
      <Table>
        <TableHead>
          <TableRow>
            {columnHeaders.map((col) => (
              <TableCell key={col.key}>{col.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, idx) => (
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
      </Table>
    </Paper>
  );
}
