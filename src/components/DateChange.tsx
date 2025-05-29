import { Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

type Props = {
  from: Date | null;
  to: Date | null;
  onChangeFrom: (date: Date | null) => void;
  onChangeTo: (date: Date | null) => void;
  labelFrom?: string;
  labelTo?: string;
  disabled?: boolean;
};

export function DateRangePicker({
  from,
  to,
  onChangeFrom,
  onChangeTo,
  labelFrom = "Дата от",
  labelTo = "Дата до",
  disabled = false,
}: Props) {
  return (
    <Box display="flex" gap={2}>
      <DatePicker
        label={labelFrom}
        value={from}
        onChange={onChangeFrom}
        disabled={disabled}
      />
      <DatePicker
        label={labelTo}
        value={to}
        maxDate={new Date()}
        onChange={onChangeTo}
        disabled={disabled}
      />
    </Box>
  );
}
