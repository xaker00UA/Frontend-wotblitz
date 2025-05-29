// TankGrid.tsx
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { APIItemTank, APIRestStatsTank } from "../api/generated";
import React from "react";
type TankStats = Pick<
  APIRestStatsTank,
  "battles" | "winrate" | "damage" | "accuracy" | "survival"
>;

export type Tank = Pick<APIItemTank, "tank_id" | "name" | "images"> & {
  all: TankStats;
  level: string | number;
};

interface Props {
  tanks: Tank[] | null;
}

const placeholderImg = "https://via.placeholder.com/300x140?text=No+Image";

export default function TankGrid({ tanks }: Props) {
  if (!tanks) return null;

  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<keyof TankStats | "">("");

  const [visibleTanks, setVisibleTanks] = useState(20);
  const observer = useRef<IntersectionObserver | null>(null);

  // Колбэк для последнего элемента
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (observer.current) observer.current.disconnect(); // отключаем предыдущий

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleTanks((prev) => prev + 20);
        }
      },
      {
        rootMargin: "100px",
      }
    );

    if (node) observer.current.observe(node); // подключаем новый
  }, []);

  const filteredTanks = useMemo(() => {
    let result = tanks;
    if (levelFilter !== "all") {
      result = result.filter((tank) => {
        const level = tank.level ?? "undefined";
        return String(level) === levelFilter;
      });
    }
    if (sortKey) {
      result = [...result].sort(
        (a, b) => (b.all?.[sortKey] ?? 0) - (a.all?.[sortKey] ?? 0)
      );
    }
    return result;
  }, [tanks, levelFilter, sortKey]);

  const levelOptions = useMemo(() => {
    const levels = new Set<string>();
    tanks.forEach((tank) => {
      const lvl = tank.level ?? "undefined";
      levels.add(String(lvl));
    });
    return Array.from(levels).sort((a, b) => {
      if (a === "undefined") return 1;
      if (b === "undefined") return -1;
      return Number(a) - Number(b);
    });
  }, [tanks]);

  return (
    <Box key="start" sx={{ p: 2 }}>
      <Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <FormControl size="small">
          <InputLabel>Уровень</InputLabel>
          <Select
            value={levelFilter}
            label="Уровень"
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            <MenuItem value="all">Все</MenuItem>
            {levelOptions.map((lvl) => (
              <MenuItem key={lvl} value={lvl}>
                {lvl}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel>Сортировка</InputLabel>
          <Select
            defaultValue="Без сортировки"
            label="Сортировка"
            onChange={(e) => setSortKey(e.target.value as any)}
          >
            <MenuItem value="Без сортировки">Без сортировки</MenuItem>
            <MenuItem value="battles">Battles</MenuItem>
            <MenuItem value="winrate">Winrate</MenuItem>
            <MenuItem value="damage">Damage</MenuItem>
            <MenuItem value="accuracy">Accuracy</MenuItem>
            <MenuItem value="survival">Survival</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={2}>
        {filteredTanks.slice(0, visibleTanks).map((tank, index) => (
          <Grid
            size={{ lg: 2, sm: 4, md: 3, xs: 6 }}
            ref={index === visibleTanks - 1 ? lastElementRef : null}
            key={tank.tank_id}
          >
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                boxShadow: 3,
              }}
            >
              <CardMedia
                component="img"
                height="auto"
                width="auto"
                image={tank.images?.preview || placeholderImg}
                alt={tank.name}
                sx={{
                  objectFit: "cover",
                  width: "100%",
                  minHeight: 180,
                  backgroundColor: "#eee",
                }}
              />
              <CardContent
                sx={{ display: "flex", flexDirection: "column", flex: 1 }}
              >
                {/* Имя */}
                <Box mb={1}>
                  <Typography
                    variant="h6"
                    noWrap={false}
                    align="center"
                    height={64}
                  >
                    {tank.name || "undefined"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                  }}
                >
                  {tank.all ? (
                    <>
                      {[
                        ["Level", tank.level ?? "undefined"],
                        ["Battles", tank.all.battles],
                        ["Winrate", `${tank.all.winrate}%`],
                        ["Damage", tank.all.damage],
                        ["Accuracy", `${tank.all.accuracy}%`],
                        ["Survival", `${tank.all.survival}%`],
                      ].map(([label, value]) => (
                        <Box
                          key={label}
                          display="flex"
                          width="100%"
                          alignItems="center"
                        >
                          <Typography variant="body2" color="text.secondary">
                            {label}
                          </Typography>
                          <Box
                            component="span"
                            sx={{
                              flex: 1,
                              mx: 1,
                              borderBottom: "1px dashed rgba(0,0,0,0.3)",
                              height: "1px",
                            }}
                          />
                          <Typography variant="body2">
                            {String(value)}
                          </Typography>
                        </Box>
                      ))}
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Нет данных
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}{" "}
      </Grid>
    </Box>
  );
}
