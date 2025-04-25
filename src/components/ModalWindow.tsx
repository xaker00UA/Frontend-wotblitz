import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { APIRegion } from "../api/generated";
import { useAuth } from "../hooks/AuthContext";
function RegionSelectModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { login } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const handleSelect = async (region: APIRegion) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await login(region);
      window.location.href = response.url;
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Выберите регионы</DialogTitle>
      <DialogContent>
        <ToggleButtonGroup exclusive fullWidth>
          {Object.entries(APIRegion)
            .filter(([_, value]) => value !== "na")
            .map(([key, value]) => (
              <ToggleButton
                key={key}
                onClick={() => handleSelect(value)}
                value={value}
                disabled={loading}
              >
                {key}
              </ToggleButton>
            ))}
        </ToggleButtonGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
      </DialogActions>
    </Dialog>
  );
}

export default RegionSelectModal;
