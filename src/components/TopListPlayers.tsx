import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import { APIRegion } from "../api/generated";

const FlexBox = styled("div")`
  display: flex;
  gap: 20px;
  justify-content: center;
  padding: 20px;
`;

const StyledCard = styled(Card)`
  width: 300px;
  text-align: center;
  border-radius: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
`;

const StyledListItem = styled(ListItem)`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  transition: background 0.3s, transform 0.2s;

  &:hover {
    transform: scale(1.02); /* Лёгкое увеличение */
  }

  span {
    transition: color 0.3s, font-weight 0.3s;
  }

  &:hover span {
    color: #1677ff; /* Синий цвет при наведении */
    font-weight: bold; /* Делаем жирным */
  }
`;

interface Response {
  name: string;
  region: APIRegion;
  battles?: number;
  wins?: number;
  damage?: number;
}

interface Props {
  battles: Response[] | null;
  wins: Response[] | null;
  damage: Response[] | null;
}

const TopListPlayers = ({ battles, wins, damage }: Props) => {
  //   if (!battles || !wins || !damage) return;
  const text = "Учитываються только где больше 20 боев";

  return (
    <>
      <Typography variant="h4">Топ игроков недели</Typography>
      <FlexBox>
        <CategoryCard title="Топ по боям" data={battles} parameter="battles" />
        <CategoryCard
          title="Топ по победам"
          extra={text}
          data={wins}
          parameter="wins"
        />
        <CategoryCard
          title="Топ по урону"
          extra={text}
          data={damage}
          parameter="damage"
        />
      </FlexBox>
    </>
  );
};

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  data,
  parameter,
  extra,
}) => {
  const navigate = useNavigate();

  if (!data) {
    return <StyledCard />;
  }

  return (
    <StyledCard title={title} extra={extra} bordered>
      <Tooltip title={extra} placement="top">
        <List>
          {data.map((item) => (
            <StyledListItem
              key={item.name}
              onClick={() => navigate(`/${item.region}/player/${item.name}`)}
            >
              <ListItemText
                primary={item.name}
                secondary={<b>{item[parameter]}</b>}
              />
            </StyledListItem>
          ))}
        </List>
      </Tooltip>
    </StyledCard>
  );
};

export default TopListPlayers;
