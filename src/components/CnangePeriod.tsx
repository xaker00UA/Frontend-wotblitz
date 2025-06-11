import React, { useEffect, useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface DateRangePickerProps {
  onChange: (startTimestamp: number, endTimestamp: number) => void;
  message?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onChange,
  message,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    if (startDate && endDate) {
      onChange(startDate.getTime(), endDate.getTime());
    }
  }, [startDate, endDate, onChange]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box display="flex" gap={2} flexDirection="row">
        {message ? (
          <Typography sx={{ flex: 1, alignSelf: "center" }}>
            {message}
          </Typography>
        ) : null}

        <DatePicker
          label="C"
          value={startDate}
          onChange={(newValue) => setStartDate(newValue)}
          enableAccessibleFieldDOMStructure={false}
          slots={{ textField: (params) => <TextField {...params} /> }}
          sx={{ flex: 1 }} // Делаем одинаковый размер
        />

        <DatePicker
          label="По"
          value={endDate}
          onChange={(newValue) => setEndDate(newValue)}
          enableAccessibleFieldDOMStructure={false}
          slots={{ textField: (params) => <TextField {...params} /> }}
          sx={{ flex: 1 }} // Делаем одинаковый размер
        />
      </Box>
    </LocalizationProvider>
  );
};
