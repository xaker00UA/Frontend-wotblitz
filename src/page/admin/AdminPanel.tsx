import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  Paper,
  LinearProgress,
  styled,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import {
  AdminApiFp,
  APICommand,
  APICommands,
  APIRegion,
} from "../../api/generated";
import { useError } from "../../hooks/ErrorContext";

type APICommandKeys = keyof typeof APICommands;

const ProgressButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "progress",
})<{
  progress: number;
}>(({ theme, progress }) => ({
  position: "relative",
  overflow: "hidden",
  padding: "12px 24px",
  height: 56, // Устанавливаем фиксированную высоту
  color: progress === 100 ? "white" : "inherit",
  backgroundColor:
    progress === 100 ? theme.palette.success.main : theme.palette.primary.main,
  "&:disabled": {
    backgroundColor: theme.palette.grey[400],
  },
  "& .MuiLinearProgress-root": {
    position: "absolute",
    bottom: 0, // Прогресс начинается снизу
    left: 0,
    width: "100%",
    height: "100%",
    transform: "rotate(180deg)", // Поворачиваем прогресс-бар, чтобы он шел снизу вверх
    zIndex: 1,
  },
  "& .MuiButton-label": {
    position: "relative",
    zIndex: 2, // Текст будет поверх прогресса
  },
}));

export default function AdminPanel() {
  const api = AdminApiFp();
  const addError = useError();
  const navigate = useNavigate();

  const [loadingCommands, setLoadingCommands] = useState<
    Record<APICommandKeys, boolean>
  >({
    ResetUser: false,
    ResetClan: false,
    DeleteUser: false,
    DeleteClan: false,
    UpdatePlayerDb: false,
    UpdateClanDb: false,
  });

  const [progress, setProgress] = useState(10);

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

  const handleCommand = async (command: string) => {
    setLoadingCommands((prev) => ({ ...prev, [command]: true }));
    setProgress(0); // Начинаем с 0%

    // Таймер для прогресса
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 400); // Каждый 400мс увеличиваем прогресс на 10%

    setTimeout(() => {
      // Когда выполнение завершено (например, после 4 секунд)
      setLoadingCommands((prev) => ({ ...prev, [command]: false }));
      setProgress(100); // Устанавливаем финальный прогресс
    }, 4000);
  };
  //     try {
  //       const request = await api.protectedRouteAdminCommandsPost({
  //         command,
  //         region: "eu", // или выбирай из select
  //       });
  //       await request();
  //     } catch (e) {
  //       const err = e as AxiosError<any>;
  //       addError(err.response?.data?.detail ?? "Ошибка выполнения команды");
  //     } finally {
  //       setLoadingCommands((prev) => ({ ...prev, [command]: false }));
  //     }
  //   };

  useEffect(() => {
    verify();
  }, []);

  return (
    <Box p={4}>
      <Stack spacing={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Админ-панель</Typography>
          <Button variant="outlined" color="secondary" onClick={logout}>
            Выйти
          </Button>
        </Box>

        {/* Информационная панель */}
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="subtitle1">Информация:</Typography>
          <Typography variant="body2">
            Здесь может быть любая информация (например, статус сервера,
            количество кланов и т.д.).
          </Typography>
        </Paper>

        {/* Команды */}
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Команды:
          </Typography>
          <Stack direction="row" spacing={2}>
            <ProgressButton
              variant="contained"
              onClick={() => handleCommand("DeleteClan")}
              disabled={loadingCommands.DeleteClan}
              progress={progress} // Передаем прогресс в компонент кнопки
            >
              {loadingCommands.DeleteClan
                ? `${progress}% - Пересоздаём кланы...`
                : "Пересоздать кланы"}
            </ProgressButton>
            {/* <Button
              variant="contained"
              onClick={() => handleCommand("REFRESH_CACHE")}
              disabled={loadingCommands.REFRESH_CACHE}
              startIcon={
                loadingCommands.REFRESH_CACHE ? (
                  <CircularProgress size={20} />
                ) : null
              }
            >
              Обновить кэш
            </Button> */}
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}
