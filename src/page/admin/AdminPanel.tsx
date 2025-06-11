import {
  Box,
  Button,
  Stack,
  Typography,
  Paper,
  LinearProgress,
  useTheme,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import {
  AdminApiFp,
  APICommands,
  APIRegion,
  APIAdminStats,
  APIRestUserDB,
} from "../../api/generated";
import { useError, useSuccess } from "../../hooks/ErrorContext";
import Search from "../../components/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
export default function AdminPanel() {
  const api = AdminApiFp();
  const addError = useError();
  const addSuccess = useSuccess();
  const navigate = useNavigate();
  const [data, setData] = useState<APIAdminStats | null>(null);

  const theme = useTheme();

  const verify = async () => {
    try {
      const request = await api.verifyTokenAdminVerifyGet();
      await request();
    } catch (e) {
      const err = e as AxiosError<any>;
      addError(err.response?.data?.detail ?? "Ошибка авторизации");
      navigate("/admin/login");
    }
  };

  const logout = async () => {
    const request = await api.logoutAdminLogoutPost();
    await request();
    await verify();
  };
  const adminInfo = async () => {
    const request = await api.infoAdminInfoGet(100);
    const response = await request();
    setData(response.data);
  };
  useEffect(() => {
    adminInfo();
    verify();
  }, []);

  const handleCommand = async (
    command: APICommands,
    region?: APIRegion,
    args?: string
  ) => {
    try {
      const request = await api.protectedRouteAdminCommandsPost({
        command: command,
        region: region,
        arguments: args, // или выбирай из select
      });
      await request();
      addSuccess("Команда успешно выполнена");
    } catch (e) {
      const err = e as AxiosError<any>;
      addError(err.response?.data?.detail ?? "Ошибка выполнения команды");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 60px)",
        display: "flex",
        flexDirection: "column",
        p: 4,
      }}
    >
      {/* Хедер */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">Админ-панель</Typography>
        <Button variant="outlined" color="secondary" onClick={logout}>
          Выйти
        </Button>
      </Box>

      {/* Контент: левая и правая колонка */}
      <Box sx={{ flex: 1, display: "flex", flexGrow: 1, gap: 2 }}>
        {/* Левая колонка (Команды - 2/3) */}
        <Box sx={{ flex: 3, height: 600 }}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Команды:
            </Typography>
            <Stack sx={{ height: "100%" }} direction="column" spacing={12}>
              <Stack direction="row" spacing={2}>
                <Search AdminFunction={handleCommand}></Search>
              </Stack>
              <Stack direction="row" spacing={2}>
                <ProgressButton
                  command={APICommands.UpdateClanDb}
                  duration={50 * 1000}
                  label="Обновить бд кланов"
                  onExecute={handleCommand}
                />

                <ProgressButton
                  command={APICommands.UpdatePlayerDb}
                  duration={130 * 1000}
                  label="Обновить бд игроков"
                  onExecute={handleCommand}
                />
              </Stack>
            </Stack>
          </Paper>
        </Box>

        {/* Правая колонка (Информация - 1/3) */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 2,
          }}
        >
          <Paper elevation={2} sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "end" }}>
              <IconButton sx={{ alignSelf: "flex-end" }} onClick={adminInfo}>
                <RestartAltIcon />
              </IconButton>
            </Box>
            <Typography variant="subtitle1">Общая информация:</Typography>
            <Typography variant="body2">
              Сервер уже зупущен: {data?.uptime_seconds} секунд <br />
              Пользователи: {data?.user_count}
              <br />
              Кланы: {data?.clan_count}
              <br />
              Последнее обновление игроков: {data?.last_players_update}
              <br />
              Последнее обновление кланов: {data?.last_clan_update}
              <br />
              Активные пользователей: {data?.count_active_users}
              <br />
              Список активных пользователей:
              <br />
              {data !== null && data?.active_users_list?.length > 0 ? (
                <ul>
                  {data.active_users_list.map((user: APIRestUserDB) => (
                    <li key={user.player_id}>{user.name}</li>
                  ))}
                </ul>
              ) : (
                <p>Нет активных пользователей</p>
              )}
              Вызовы внешнего API: {data?.external_api_calls}
              <br />
              Вызовы API сервера:
              <br />
              <ul>
                {Object.entries(data?.custom_api_calls || {}).map(
                  ([key, value]) => (
                    <li key={key}>
                      {key}: {value}
                    </li>
                  )
                )}
              </ul>
            </Typography>
          </Paper>

          <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
            <Typography variant="subtitle1">Последние 100 логов:</Typography>
            <Typography variant="body2">
              <pre
                style={{
                  background: theme.palette.background.paper,
                  padding: "10px",
                  borderRadius: "5px",
                  overflowY: "auto",
                  maxHeight: "300px", // Ограничение высоты для скролла
                  whiteSpace: "pre-wrap", // Чтобы строки переносились
                  wordWrap: "break-word", // Разбивать длинные слова
                }}
              >
                {JSON.stringify(
                  data?.last_1000_logs.slice().reverse(),
                  null,
                  2
                )}
              </pre>
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

interface Props {
  label: string;
  command: APICommands;
  duration: number; // Время выполнения (в миллисекундах)
  onExecute: (
    command: APICommands,
    region?: APIRegion,
    args?: string
  ) => Promise<void>; // Функция для вызова
}
const ProgressButton = ({ label, command, duration, onExecute }: Props) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleClick = async () => {
    setLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 100 / (duration / 100), 100));
    }, 100);

    try {
      await onExecute(command); // Вызываем функцию
      // await new Promise((resolve) => setTimeout(resolve, duration));
    } catch (e) {
    } finally {
      clearInterval(interval);
      setProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLoading(false);
      setTimeout(() => setProgress(0), 500); // Сброс после завершения
    }
  };

  return (
    <Button
      variant="contained"
      onClick={handleClick}
      disabled={loading}
      sx={{ position: "relative", overflow: "hidden" }}
    >
      {/* Полупрозрачный цветной слой */}
      {loading && (
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: `${progress}%`, // Заполняем снизу вверх
            backgroundColor: "success.light", // Цвет заливки (можно менять)
            transition: "height 0.1s ease-in-out",
          }}
        />
      )}
      {label}
    </Button>
  );
};

function AnimationButton() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleClick = () => {
    setLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 100 / (5000 / 100), 100));
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setLoading(false);
    }, 5000);
  };

  return (
    <>
      {loading ? (
        <LinearProgress
          variant="determinate"
          value={progress}
          color="success"
          sx={{ width: 200, height: 40 }}
        />
      ) : (
        <Button
          variant="contained"
          onClick={handleClick}
          sx={{
            width: 200,
            height: 40,
          }}
        >
          Загрузить
        </Button>
      )}
    </>
  );
}
