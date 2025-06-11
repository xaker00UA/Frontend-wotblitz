import { useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
} from "@mui/material";

import { APIMedal } from "../api/generated";

interface Props {
  session: APIMedal[] | undefined;
  current: APIMedal[] | undefined;
}

export function Medal({ session, current }: Props) {
  if (!session || !current) return null;

  const [showAll, setShowAll] = useState(false);
  const customOrder = [
    "markOfMastery",
    "warrior",
    "markOfMasteryI",
    "markOfMasteryII",
    "markOfMasteryIII",
  ];

  const sortedMedals = current.sort((a, b) => {
    const indexA = customOrder.indexOf(a.name);
    const indexB = customOrder.indexOf(b.name);

    // Если оба элемента есть в `customOrder`, сортируем по `customOrder`
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    // Если только один элемент есть в `customOrder`, он ставится первым
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    // Если ни один не найден в `customOrder`, сортируем по `count`
    return b.count - a.count;
  });

  const filterMedals = sortedMedals.filter((medal) => medal.count > 0);

  const displayedMedals = showAll ? filterMedals : filterMedals.slice(0, 5);
  return (
    <div>
      <Grid container spacing={2}>
        {displayedMedals.map((medal, index) => (
          <Grid sx={{ lg: 3, sm: 6, md: 4, xs: 12 }} key={index}>
            <Card sx={{ maxWidth: 150, height: "170px" }}>
              <CardMedia
                component="img"
                height="70"
                sx={{ width: "100%", objectFit: "contain" }}
                image={medal.image}
                alt={medal.name}
              />
              <CardContent>
                <Typography variant="body1" noWrap>
                  {medal.name}
                </Typography>
                <Typography variant="subtitle2">
                  Сейчас: {medal.count}
                </Typography>
                <Typography color="success.main" variant="subtitle2">
                  Сесиия:
                  {session.find((item) => item.name === medal.name)?.count}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Button
        onClick={() => setShowAll(!showAll)}
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        {showAll ? "Скрыть" : "Показать все"}
      </Button>
    </div>
  );
}
