import Link from "@mui/material/Link";
import GitHabIcon from "../assets/Github.svg";
import TelegramIcon from "../assets/Telegram.svg";
import DiscordIcon from "../assets/Discord.svg";
import { Divider, Stack, Typography, useTheme, Box } from "@mui/material";
import { useMediaQuery } from "@mui/material";
function Footer() {
  const theme = useTheme();
  const isx = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        maxWidth: "1440px",
        px: 2,
        py: 4,
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        backgroundColor: theme.palette.background.paper,
        boxShadow: "0px -2px 8px rgba(240, 18, 18, 0.918)",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 2, md: 4 }}
        justifyContent="center"
        alignItems="center"
        divider={
          <Divider
            orientation={isx ? "horizontal" : "vertical"}
            flexItem
            // orientation={{ xs: "horizontal", md: "vertical" }}
            // flexItem
          />
        }
      >
        <Stack direction="column" spacing={1} alignItems="center">
          <Typography>WotblitzStats</Typography>
          <Typography variant="body2">Version product: 1.4</Typography>
        </Stack>

        <Stack direction="column" spacing={1} alignItems="center">
          <Typography>Contact</Typography>
          <Link
            href="https://t.me/xake_r777"
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
          >
            <img
              style={{ width: "24px", height: "24px" }}
              src={TelegramIcon}
              alt="Telegram"
            />
          </Link>
          <Typography variant="body2" noWrap>
            Email: ivanbozhko@gmail.com
          </Typography>
        </Stack>

        <Stack direction="column" spacing={1} alignItems="center">
          <Typography>Боты</Typography>
          <Link
            href="https://t.me/wotblitz_stats_bot"
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
          >
            <img
              style={{ width: "24px", height: "24px" }}
              src={TelegramIcon}
              alt="Telegram Bot"
            />
          </Link>
          <Link
            href="https://discord.com/oauth2/authorize?client_id=1211966360322572330"
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
          >
            <img
              style={{ width: "24px", height: "24px" }}
              src={DiscordIcon}
              alt="Discord Bot"
            />
          </Link>
        </Stack>

        <Stack direction="column" spacing={1} alignItems="center">
          <Typography>Исходный код</Typography>
          <Link
            href="https://github.com/xaker00UA/Backend-on-fastapi"
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
          >
            <img
              style={{ width: "24px", height: "24px" }}
              src={GitHabIcon}
              alt="GitHub"
            />
          </Link>
        </Stack>
      </Stack>
    </Box>
  );
}

export default Footer;
