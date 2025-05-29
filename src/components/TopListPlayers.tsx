import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
  styled,
  Link,
} from "@mui/material";
import { APITopPlayer } from "../api/generated";

const FlexBox = styled("div")`
  display: flex;
  gap: 20px;
  justify-content: center;
  padding: 20px;
  flex-wrap: wrap;
`;

const StyledCard = styled(Card)`
  flex: 1;
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
  border-radius: 35px;
  &:hover {
    transform: scale(1.02);
    background-color: #f0ebebbc;
  }

  span {
    transition: color 0.3s, font-weight 0.3s;
  }

  &:hover span {
    color: #1677ff;
    font-weight: bold;
  }
`;

interface Props {
  battles: APITopPlayer[] | null;
  wins: APITopPlayer[] | null;
  damage: APITopPlayer[] | null;
}

const TopListPlayers = ({ battles, wins, damage }: Props) => {
  if (!battles || !wins || !damage) return null;

  const tooltipText = "Учитываются только игроки с более чем 20 боями";

  return (
    <>
      <Typography variant="h4" align="center" sx={{ mt: 4 }}>
        Топ игроков недели
      </Typography>
      <FlexBox>
        <CategoryCard title="Топ по боям" data={battles} />
        <CategoryCard
          title="Топ по победам"
          data={wins}
          tooltip={tooltipText}
        />
        <CategoryCard
          title="Топ по урону"
          data={damage}
          tooltip={tooltipText}
        />
      </FlexBox>
    </>
  );
};

interface CategoryCardProps {
  title: string;
  data: APITopPlayer[];
  tooltip?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  data,
  tooltip,
}) => {
  const navigate = useNavigate();

  return (
    <Tooltip title={tooltip ?? ""} placement="top">
      <StyledCard>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <List disablePadding>
            {data.slice(0, 10).map((item) => {
              const playerUrl = `/${item.region}/player/${item.name}`;
              return (
                <StyledListItem
                  key={`${item.region}-${item.player_id}`}
                  onClick={() => navigate(playerUrl)}
                >
                  <ListItemText
                    primary={
                      <Link
                        href={playerUrl}
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        color="inherit"
                      >
                        {item.name}
                      </Link>
                    }
                  />
                  <span>{item.value}</span>
                </StyledListItem>
              );
            })}
          </List>
        </CardContent>
      </StyledCard>
    </Tooltip>
  );
};

export default TopListPlayers;
