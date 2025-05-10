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
  Box,
} from "@mui/material";
import { APIClanTop } from "../api/generated";

const FlexBox = styled("div")`
  display: flex;
  gap: 20px;
  justify-content: center;
  padding: 20px;
  flex-wrap: wrap;
`;

const StyledCard = styled(Card)`
  /* width: 300px; */
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
  data: APIClanTop[] | null;
}

const TopClanList = ({ data }: Props) => {
  if (!data) return null;

  return (
    <>
      <Typography variant="h4" align="center" sx={{ mt: 4 }}>
        Топ кланов недели
      </Typography>
      <FlexBox>
        <CategoryCard title="Топ основан на рейтинге" data={data} />
      </FlexBox>
    </>
  );
};

interface CategoryCardProps {
  title: string;
  data: APIClanTop[];
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, data }) => {
  const navigate = useNavigate();

  return (
    <Tooltip title={"asda"} placement="top">
      <StyledCard>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>

          {/* Заголовки для колонок */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              px: 2,
              mb: 1,
              fontWeight: "bold",
              color: "text.secondary",
            }}
          >
            <Box sx={{ flex: 2 }}>Клан</Box>
            <Box sx={{ flex: 1, textAlign: "right" }}>Рейтинг</Box>
            <Box sx={{ flex: 1, textAlign: "right" }}>Бои</Box>
            <Box sx={{ flex: 1, textAlign: "right" }}>Победы %</Box>
            <Box sx={{ flex: 1, textAlign: "right" }}>Урон</Box>
          </Box>

          <List disablePadding>
            {data.slice(0, 10).map((item) => {
              const clanUrl = `/${item.region}/clan/${item.tag}`;
              return (
                <StyledListItem
                  key={`${item.region}-${item.clan_id}`}
                  onClick={() => navigate(clanUrl)}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <ListItemText
                    primary={
                      <Link
                        href={clanUrl}
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        color="inherit"
                      >
                        {item.name}
                      </Link>
                    }
                    sx={{ flex: 2 }}
                  />
                  <span style={{ flex: 1, textAlign: "right" }}>
                    {item.rating}
                  </span>
                  <span style={{ flex: 1, textAlign: "right" }}>
                    {item.general_battles}
                  </span>
                  <span style={{ flex: 1, textAlign: "right" }}>
                    {item.general_wins}
                  </span>
                  <span style={{ flex: 1, textAlign: "right" }}>
                    {item.averageDamage}
                  </span>
                </StyledListItem>
              );
            })}
          </List>
        </CardContent>
      </StyledCard>
    </Tooltip>
  );
};

export default TopClanList;
