import { Typography, Box, Paper } from "@mui/material";
import { Link } from "react-router-dom";

function FaqPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Часто задаваемые вопросы (FAQ)
      </Typography>

      <Typography variant="h6" gutterBottom>
        Где можно посмотреть историю релизов?
      </Typography>
      <Typography variant="body1" gutterBottom>
        История релизов доступна{" "}
        <Link to="/release" style={{ color: "#1976d2" }}>
          тут
        </Link>
        .
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Как считается рейтинг кланов?
      </Typography>
      <Typography variant="body1" gutterBottom>
        Рейтинг кланов вычисляется на основе количества боёв, процента побед и
        среднего урона. Вес коэффициентов следующий:
      </Typography>

      <Paper elevation={3} sx={{ p: 2, mt: 2, fontFamily: "monospace" }}>
        <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
          {`rating = (x_d * 0.4) + (x_w * 0.3) + (x_b * 0.3)

где:
  x_d = (средний урон - minDamage) / (maxDamage - minDamage)
  x_w = (процент побед - minWins) / (maxWins - minWins)
  x_b = (бои - minBattles) / (maxBattles - minBattles)`}
        </pre>
      </Paper>

      <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
        ⚖️ Таким образом, итоговый рейтинг учитывает баланс между активностью
        клана, эффективностью в боях и нанесённым уроном.
      </Typography>
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Когда происходит обновление рейтинга кланов и обновление топ игроков?
      </Typography>
      <Typography variant="body2">
        Статистика игроков и кланов обновляется раз в сутки. В 12:00 по UTC.
        Рейтинг соотвестнно тоже пересчитывается. Но и-за кеша может происходить
        задержка.
      </Typography>
    </Box>
  );
}

export default FaqPage;
