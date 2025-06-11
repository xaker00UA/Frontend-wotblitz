import { createContext, useContext, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

interface ConfirmationContextType {
  confirm: (message: string, action: () => void) => void;
}

const ConfirmationContext = createContext<ConfirmationContextType>({
  confirm: () => {},
});

export const useConfirmation = () => useContext(ConfirmationContext);

export function ConfirmationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState<() => void>(() => {});

  const confirm = (message: string, action: () => void) => {
    setMessage(message);
    setOnConfirm(() => action);
    setOpen(true);
  };
  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <ConfirmationContext.Provider value={{ confirm }}>
      {children}

      <Dialog fullWidth open={open}>
        <DialogTitle>Подтверждение</DialogTitle>
        <DialogContent>{message}</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Отмена
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Подтвердить
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmationContext.Provider>
  );
}
