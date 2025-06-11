import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";

function HomePage() {
  return (
    <Container sx={{ flex: 1, mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Добро пожаловать на BlitzStats!
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          gutterBottom
        >
          Полный контроль за игроками и кланами в одном месте
        </Typography>
        <Typography variant="body1" sx={{ mt: 3 }}>
          Наш сайт разработан специально для игроков Вотблиц. Мы предлагаем
          удобный вариант для слежения за пользователями, игроками и кланами.
          Благодаря нашему сервису вы всегда сможете оперативно получать
          актуальную информацию и принимать обоснованные решения.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Для полного управления сессией и доступа ко всем функциональным
          возможностям сайта необходима авторизация.Войдите в свой аккаунт
          wargaming, чтобы:
        </Typography>
        <Box component="ul" sx={{ pl: 4, mt: 1 }}>
          <Typography component="li" variant="body1" sx={{ mt: 1 }}>
            Отслеживать активность игроков в реальном времени
          </Typography>
          <Typography component="li" variant="body1" sx={{ mt: 1 }}>
            Управлять информацией по кланам и статистикой игр
          </Typography>
          <Typography component="li" variant="body1" sx={{ mt: 1 }}>
            Просматривать подробные отчеты и аналитические данные
          </Typography>
          <Typography component="li" variant="body1" sx={{ mt: 1 }}>
            Получать рекомендации по улучшению игрового процесса
          </Typography>
        </Box>
        <Box component="div">
          <Typography variant="body1" sx={{ mt: 2 }}>
            Используйте поиск для просмотра текущей статистики игроков
          </Typography>
        </Box>
        <Box component="div">
          <Typography variant="body1" sx={{ mt: 2 }}>
            Ответы на вопросы и рекомендации можно найти{" "}
            <Link component={RouterLink} to="/about">
              здесь
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default HomePage;
