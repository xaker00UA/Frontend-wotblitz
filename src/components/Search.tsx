import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { styled, lighten, darken } from "@mui/material/styles";
import { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import SearchIcon from "@mui/icons-material/Search";
import SelectRegion from "./SelectRegion";
import {
  PlayerApiFp,
  ClanApiFp,
  APIClanDB,
  APIRestUserDB,
  APIRegion,
} from "../api/generated/";
import { Divider, InputAdornment, SelectChangeEvent } from "@mui/material";
import { useNavigate } from "react-router-dom";

const GroupHeader = styled("div")(({ theme }) => ({
  position: "sticky",
  top: "-8px",
  padding: "4px 10px",
  color: theme.palette.primary.main,
  backgroundColor: lighten(theme.palette.primary.light, 0.85),
  // Обрабатываем темную тему
  ...(theme.palette.mode === "dark" && {
    backgroundColor: darken(theme.palette.primary.main, 0.8),
  }),
}));

const GroupItems = styled("ul")({
  padding: 0,
});

export default function Search() {
  const searchPlayers = async (query: string) => {
    const request = await PlayerApiFp().searchSearchGet(query);
    return (await request()).data; // или return (await request()).data
  };

  const searchClans = async (query: string) => {
    const request = await ClanApiFp().searchClanClanSearchGet(query);
    return (await request()).data;
  };

  const [clans, setClans] = useState<APIClanDB[]>([]);
  const [players, setPlayers] = useState<APIRestUserDB[]>([]);
  const [region, setRegion] = useState<APIRegion>(APIRegion.Eu);
  const navigate = useNavigate();

  const changeRegion = (event: SelectChangeEvent) => {
    const value = event.target.value as APIRegion;
    setRegion(value);
  };

  let timeout: ReturnType<typeof setTimeout>;

  const handlerSearch = (value: string) => {
    clearTimeout(timeout);

    timeout = setTimeout(async () => {
      const [playerRes, clanRes] = await Promise.allSettled([
        searchPlayers(value),
        searchClans(value),
      ]);

      if (playerRes.status === "fulfilled") {
        setPlayers([
          { name: value, player_id: 1, region: region },
          ...playerRes.value,
        ]);
      } else {
        setPlayers([{ name: value, player_id: 1, region: region }]);
      }

      if (clanRes.status === "fulfilled") {
        setClans([
          {
            clan_id: 1,
            members: [],
            name: value,
            tag: value.toUpperCase(),
            members_count: 0,
            region: region,
            timestamp: 0,
          },
          ...clanRes.value,
        ]);
      } else {
        setClans([
          {
            clan_id: 1,
            members: [],
            name: value,
            tag: value.toUpperCase(),
            members_count: 0,
            region: region,
            timestamp: 0,
          },
        ]);
      }
    }, 800);
  };

  const options = [
    ...players.map((item) => ({ ...item, group: "Players" })),
    ...clans.map((item) => ({ ...item, group: "Clans" })),
  ];

  return (
    <>
      <Autocomplete
        options={options}
        onChange={(_, value) => {
          if (!value) return;
          if (value.group === "Clans" && "tag" in value) {
            navigate(`/${region}/clan/${value.tag}`);
          } else {
            navigate(`/${region}/player/${value.name}`);
          }
        }}
        onInputChange={(_, value, reason) => {
          if (reason !== "input") return;
          handlerSearch(value);
        }}
        getOptionLabel={(option) => {
          if (option.group === "Players") {
            return option.name;
          }
          if (option.group === "Clans" && "tag" in option) {
            return option.tag;
          }
          return "—";
        }}
        renderOption={(props, option) => (
          <li {...props}>
            {"tag" in option ? (
              <>
                <GroupsIcon sx={{ paddingRight: "10px" }} />
                {option.tag}
              </>
            ) : (
              <>
                <PersonIcon sx={{ paddingRight: "10px" }} />
                {option.name}
              </>
            )}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
            {...params}
            placeholder="Введите имя игрока или клана"
          />
        )}
        sx={{ m: 0, width: "300px", height: "100%" }}
        noOptionsText="Нет данных"
        groupBy={(option) => option.group}
        renderGroup={(params) => (
          <li key={params.key}>
            <GroupHeader>{params.group}</GroupHeader>
            <GroupItems>{params.children}</GroupItems>
          </li>
        )}
      ></Autocomplete>
      <Divider orientation="vertical" variant="middle" flexItem />
      <SelectRegion value={region} onChange={changeRegion} />
    </>
  );
}
