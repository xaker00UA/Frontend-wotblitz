import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/plugins.pkgd.min.js";
import FroalaEditorComponent from "react-froala-wysiwyg";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
interface CreatePostProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

function FormCreatePost({ open, onClose, onSubmit }: CreatePostProps) {
  const text = localStorage.getItem("text");
  const version = localStorage.getItem("version");
  const [form, setForm] = useState({
    version: version ? version : "",
    text: text ? text : "",
  });

  const config = {
    imageDefaultWidth: 0,
    heightMin: 200,
    heightMax: 600,
    charCounterCount: true,
    placeholderText: "Введите текст...",
    width: "500px",
    attribution: false,
    pasteImage: true,
    fileUpload: false,
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    localStorage.setItem("saveText", e.target.value);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>Создать релиз</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Версия релиза"
              name="version"
              type="text"
              value={form.version}
              onChange={handleChange}
              fullWidth
            />
            <div style={{ padding: 30 }}>
              <FroalaEditorComponent
                tag="textarea"
                model={form.text}
                onModelChange={(newText: string) => {
                  setForm({ ...form, text: newText });
                  localStorage.setItem("text", newText);
                }}
                config={config}
              ></FroalaEditorComponent>
              <FroalaEditorView model={form.text} />
            </div>
          </Stack>
          <DialogActions>
            <Button onClick={onClose} color="secondary">
              Отмена
            </Button>
            <Button
              onClick={() => {
                onSubmit(form);
                onClose();
              }}
              variant="contained"
              color="primary"
            >
              Создать
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default FormCreatePost;
