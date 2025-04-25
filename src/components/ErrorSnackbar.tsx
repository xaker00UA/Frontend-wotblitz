import { Snackbar, Alert } from "@mui/material";
import { useErrorData } from "../hooks/ErrorContext";
import React from "react";

export const ErrorSnackbar = React.memo(() => {
  const { error, removeError } = useErrorData();
  if (!error) return null; // Если нет ошибки, ничего не отображаем

  return (
    <Snackbar
      key={error.id}
      open
      onClose={removeError}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      <Alert severity="error" onClose={removeError} sx={{ width: "100%" }}>
        {error.message}
      </Alert>
    </Snackbar>
  );
});
