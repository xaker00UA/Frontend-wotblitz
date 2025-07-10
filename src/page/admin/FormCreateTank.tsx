import React, { useState, ChangeEvent } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
} from "@mui/material";
import { useDropzone } from "react-dropzone";

interface CreateTankModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    tank_id: number;
    name: string;
    nation: string;
    tier: number;
    is_premium: boolean;
    image_big: File | null;
    image_small: File | null;
  }) => void;
}

const CreateTankModal: React.FC<CreateTankModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [tankId, setTankId] = useState<number>(1);
  const [name, setName] = useState<string>("");
  const [nation, setNation] = useState<string>("");
  const [tier, setTier] = useState<number>(1);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [imageBig, setImageBig] = useState<File | null>(null);
  const [imageSmall, setImageSmall] = useState<File | null>(null);

  const handleSubmit = () => {
    onSubmit({
      tank_id: tankId,
      name,
      nation,
      tier,
      is_premium: isPremium,
      image_big: imageBig,
      image_small: imageSmall,
    });
    // сброс
    setTankId(1);
    setName("");
    setNation("");
    setTier(1);
    setIsPremium(false);
    setImageBig(null);
    setImageSmall(null);
    onClose();
  };

  // Dropzone для большого изображения
  const {
    getRootProps: getRootPropsBig,
    getInputProps: getInputPropsBig,
    isDragActive: isDragActiveBig,
  } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      setImageBig(acceptedFiles[0]);
    },
  });

  // Dropzone для маленького изображения
  const {
    getRootProps: getRootPropsSmall,
    getInputProps: getInputPropsSmall,
    isDragActive: isDragActiveSmall,
  } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      setImageSmall(acceptedFiles[0]);
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Создать танк</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="ID танка"
            type="number"
            value={tankId}
            onChange={(e) => setTankId(Number(e.target.value))}
            slotProps={{ htmlInput: { min: 1, step: 1 } }}
            fullWidth
          />
          <TextField
            label="Название"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Нация"
            value={nation}
            onChange={(e) => setNation(e.target.value)}
            fullWidth
          />
          <TextField
            label="Уровень"
            type="number"
            value={tier}
            onChange={(e) => setTier(Number(e.target.value))}
            slotProps={{ htmlInput: { min: 1, step: 1, max: 10 } }}
            fullWidth
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isPremium}
                onChange={(e) => setIsPremium(e.target.checked)}
              />
            }
            label="Премиум танк"
          />

          {/* Dropzone для большого изображения */}
          <Box
            {...getRootPropsBig()}
            sx={{
              border: "2px dashed",
              borderColor: isDragActiveBig ? "primary.main" : "grey.400",
              borderRadius: 2,
              p: 2,
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <input {...getInputPropsBig()} />
            <Typography>
              {imageBig
                ? `Выбран файл: ${imageBig.name}`
                : isDragActiveBig
                ? "Отпустите файл здесь..."
                : "Перетащите большое изображение сюда или кликните для выбора"}
            </Typography>
          </Box>

          {/* Dropzone для маленького изображения */}
          <Box
            {...getRootPropsSmall()}
            sx={{
              border: "2px dashed",
              borderColor: isDragActiveSmall ? "primary.main" : "grey.400",
              borderRadius: 2,
              p: 2,
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <input {...getInputPropsSmall()} />
            <Typography>
              {imageSmall
                ? `Выбран файл: ${imageSmall.name}`
                : isDragActiveSmall
                ? "Отпустите файл здесь..."
                : "Перетащите маленькое изображение сюда или кликните для выбора"}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Отмена
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTankModal;
