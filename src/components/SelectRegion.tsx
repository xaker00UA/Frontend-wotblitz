import { Theme, useTheme } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { APIRegion } from "../api/generated";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 100,
    },
  },
};

const names = Object.entries(APIRegion).filter(([_, value]) => value !== "na");
function getStyles(name: string, personName: string, theme: Theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

export default function MultipleSelect({
  onChange,
  value,
}: {
  onChange: (event: SelectChangeEvent) => void;
  value: string;
}) {
  const theme = useTheme();
  return (
    <FormControl sx={{ m: 0, p: 0, height: "100%", flexGrow: 0, width: 70 }}>
      <Select
        value={value}
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none", // Убираем обводку
          },
        }}
        onChange={onChange}
        MenuProps={MenuProps}
      >
        {names.map((key) => (
          <MenuItem
            key={key[0]}
            value={key[1]}
            style={getStyles(key[0], value, theme)}
          >
            {key[0]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
