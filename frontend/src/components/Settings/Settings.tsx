import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";

interface SettingsProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { mode: "git" | "local"; value: string }) => void;
}

export default function Settings({ open, onClose, onSave }: SettingsProps) {
  const [mode, setMode] = useState<"git" | "local">("git");
  const [inputValue, setInputValue] = useState("");
  const [exclusions, setExclusions] = useState("");

  const handleSave = () => {
    onSave({ mode, value: inputValue });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <RadioGroup
          row
          value={mode}
          onChange={(e) => {
            setMode(e.target.value as "git" | "local");
            setInputValue(""); // reset field when switching
          }}
        >
          <FormControlLabel value="git" control={<Radio />} label="Git Repository" />
          <FormControlLabel value="local" control={<Radio />} label="Local Path" />
        </RadioGroup>

        {mode === "git" ? (
          <TextField
            label="Git Repository URL"
            placeholder="https://github.com/user/repo.git"
            fullWidth
            margin="normal"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        ) : (
          <TextField
            label="Local Path"
            placeholder="C:/Users/YourName/Projects"
            fullWidth
            margin="normal"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        )}
        <TextField
            label="Exclusion List"
            placeholder="Comma separated exclusion path, node_module, verb, etc.."
            fullWidth
            margin="normal"
            value={exclusions}
            onChange={(e) => setExclusions(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={!inputValue} onClick={handleSave}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
