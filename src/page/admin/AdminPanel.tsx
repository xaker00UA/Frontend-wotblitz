import {
  Box,
  Button,
  Stack,
  Typography,
  Paper,
  useTheme,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import {
  AdminApiFp,
  APICommands,
  APIAdminStats,
  APIRestUserDB,
  APITaskStatusEnum,
  PostApiFp,
} from "../../api/generated";
import { useError, useSuccess } from "../../hooks/ErrorContext";
import Search from "../../components/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CreateTankModal from "./FormCreateTank";
import FormCreatePost from "./FormCreatePost";

export default function AdminPanel() {
  const api = AdminApiFp();
  const postApi = PostApiFp();
  const addError = useError();
  const addSuccess = useSuccess();
  const navigate = useNavigate();
  const [data, setData] = useState<APIAdminStats | null>(null);
  const [openTank, setOpenTank] = useState(false);
  const [openPost, setOpenPost] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);
  const theme = useTheme();
  const [tasks, setTasks] = useState<
    Record<string, { loading: boolean; progress: number }>
  >({});

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

  const handleSendCrateTank = async (data: any) => {
    try {
      const request = await api.addTankAdminAddTankPost(
        data.tank_id,
        data.name,
        data.nation,
        data.tier,
        data.is_premium,
        undefined,
        data.image_big ? data.image_big : undefined,
        data.image_small ? data.image_small : undefined
      );
      await request();
      addSuccess("Танк успешно добавлен");
    } catch (err) {
      const messages = "Ошибка добавления танка";
      addError(messages);
    }
  };

  const pollTaskStatus = (taskId: string, command: APICommands) => {
    const intervalId = setInterval(async () => {
      try {
        const request = await api.getTaskAdminTaskTaskIdGet(taskId);
        const response = await request();
        const { status, progress } = response.data;

        setTasks((prev) => ({
          ...prev,
          [command]: { ...prev[command], progress: progress },
        }));

        if (status === APITaskStatusEnum.Done) {
          clearInterval(intervalId);
          addSuccess(`Задача ${command} завершена`);
          setTasks((prev) => ({
            ...prev,
            [command]: { loading: false, progress: 100 },
          }));
          setTimeout(() => {
            setTasks((prev) => ({
              ...prev,
              [command]: { loading: false, progress: 0 },
            }));
          }, 5000);
        }
      } catch (e) {
        clearInterval(intervalId);
        const err = e as AxiosError<any>;
        addError(err.response?.data?.detail ?? "Ошибка опроса задачи");
        setTasks((prev) => ({
          ...prev,
          [command]: { loading: false, progress: 0 },
        }));
      }
    }, 5000);
  };
  const handlePost = async (data: any) => {
    try {
      const request = await postApi.postCreatePostPost(data);
      await request();
      addSuccess("Пост успешно добавлен");
    } catch (e) {
      const err = e as AxiosError<any>;
      const errors = err.response?.data?.detail;

      if (Array.isArray(errors)) {
        const messages = errors.map((e) => e.msg).join(", ");
        addError(messages);
      } else {
        addError(errors);
      }
    }
  };
  const sendMessage = async ({ text }: { text: string }) => {
    try {
      const request = await api.sendMessageAdminMessagePost({
        message: text,
      });
      await request();
      addSuccess("Сообщение успешно отправлено");
    } catch (e) {
      console.error(e);
    }
  };
  const handleCommand = async (
    command: APICommands,
    args?: Record<string, any>
  ) => {
    if (tasks[command]?.loading) return;

    setTasks((prev) => ({
      ...prev,
      [command]: { loading: true, progress: 0 },
    }));

    try {
      const request = await api.protectedRouteAdminCommandsPost({
        command: command,
        arguments: args,
      });
      const response = await request();
      const taskId = response.data.id;

      if (taskId) {
        pollTaskStatus(taskId, command);
      } else {
        addSuccess("Команда успешно выполнена (без задачи)");
        setTasks((prev) => ({
          ...prev,
          [command]: { loading: false, progress: 100 },
        }));
      }
    } catch (e) {
      const err = e as AxiosError<any>;
      addError(err.response?.data?.detail ?? "Ошибка выполнения команды");
      setTasks((prev) => ({
        ...prev,
        [command]: { loading: false, progress: 0 },
      }));
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
                <Button onClick={() => setOpenPost(true)}>
                  Добавить релиз
                </Button>
                <Button onClick={() => setOpenMessage(true)}>
                  Отправить сообщение
                </Button>
              </Stack>
              <Stack direction="row" spacing={2}>
                <ProgressButton
                  command={APICommands.UpdateClanDb}
                  label="Обновить бд кланов"
                  onExecute={handleCommand}
                  loading={tasks[APICommands.UpdateClanDb]?.loading}
                  progress={tasks[APICommands.UpdateClanDb]?.progress}
                />
                <ProgressButton
                  command={APICommands.UpdateClanAllDb}
                  label="Обновить всю бд кланов"
                  onExecute={handleCommand}
                  loading={tasks[APICommands.UpdateClanAllDb]?.loading}
                  progress={tasks[APICommands.UpdateClanAllDb]?.progress}
                />
                <ProgressButton
                  command={APICommands.UpdatePlayerDb}
                  label="Обновить бд игроков"
                  onExecute={handleCommand}
                  loading={tasks[APICommands.UpdatePlayerDb]?.loading}
                  progress={tasks[APICommands.UpdatePlayerDb]?.progress}
                />
                <ProgressButton
                  command={APICommands.UpdatePlayerAllDb}
                  label="Обновить всю бд игроков"
                  onExecute={handleCommand}
                  loading={tasks[APICommands.UpdatePlayerAllDb]?.loading}
                  progress={tasks[APICommands.UpdatePlayerAllDb]?.progress}
                />
                <Button onClick={() => setOpenTank(true)}>Добавить танк</Button>
              </Stack>
            </Stack>
          </Paper>
          <CreateTankModal
            open={openTank}
            onSubmit={handleSendCrateTank}
            onClose={() => setOpenTank(false)}
          />
          <FormCreatePost
            open={openPost}
            onClose={() => setOpenPost(false)}
            onSubmit={handlePost}
          />
          <FormCreatePost
            open={openMessage}
            onClose={() => setOpenMessage(false)}
            onSubmit={sendMessage}
          />
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
                  maxHeight: "300px",
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
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
  onExecute: (
    command: APICommands,
    args?: Record<string, any>
  ) => Promise<void>;
  loading?: boolean;
  progress?: number;
}
const ProgressButton = ({
  label,
  command,
  onExecute,
  loading,
  progress,
}: Props) => {
  const handleClick = async () => {
    await onExecute(command);
  };

  return (
    <Button
      variant="contained"
      onClick={handleClick}
      disabled={loading}
      sx={{ position: "relative", overflow: "hidden" }}
    >
      {loading && (
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: `${progress ?? 0}%`,
            backgroundColor: "success.light",
            transition: "height 0.1s ease-in-out",
          }}
        />
      )}
      {label}
    </Button>
  );
};
