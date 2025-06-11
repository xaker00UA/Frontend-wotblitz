import { Snackbar, Alert } from "@mui/material";
import { useNotificationData } from "../hooks/ErrorContext"; // Используем обновленный контекст
import React from "react";

export const NotificationSnackbar = React.memo(() => {
  const { notification, removeNotification } = useNotificationData();
  if (!notification) return null;

  return (
    <Snackbar
      key={notification.id}
      open
      onClose={removeNotification}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      <Alert
        severity={notification.type === "error" ? "error" : "success"}
        onClose={removeNotification}
        sx={{ width: "100%" }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
});
