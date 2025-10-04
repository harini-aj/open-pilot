import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  IconButton,
  Button,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface TagsListProps {
  open: boolean;
  onClose: () => void;
  onSave: (selectModel : string) => void;
}

const TagsList: React.FC<TagsListProps> = ({ open, onClose, onSave }) => {
  const [models, setModels] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("");

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch("http://localhost:11434/api/tags");
        if (!res.ok) throw new Error("Failed to fetch tags");
        const data = await res.json();
        setModels(data.models || []);
      } catch (err: any) {
        setError(err.message);
      }
    };

    if (open) {
      fetchTags();
    }
  }, [open]);

  const handleCopy = (item: any) => {
    navigator.clipboard.writeText(JSON.stringify(item, null, 2));
    setCopied(true);
  };

  const handleSelect = (modelName: string) => {
    setSelectedModel(modelName);
  };

  const handleSave = () => {
    if (selectedModel) {
      onSave(selectedModel);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Available Models</DialogTitle>
      <DialogContent>
        {error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Card
            sx={{
              maxWidth: 800,
              margin: "1rem auto",
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            <CardContent>
              <RadioGroup
                value={selectedModel}
                onChange={(e) => handleSelect(e.target.value)}
              >
                <List>
                  {models.map((model, index) => (
                    <ListItem
                      key={index}
                      alignItems="flex-start"
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                        bgcolor:
                          selectedModel === model.name
                            ? "action.selected"
                            : "transparent",
                      }}
                      secondaryAction={
                        <Tooltip title="Copy JSON">
                          <IconButton
                            edge="end"
                            onClick={() => handleCopy(model)}
                            sx={{ opacity: 0.6, "&:hover": { opacity: 1 } }}
                          >
                            <ContentCopyIcon />
                          </IconButton>
                        </Tooltip>
                      }
                    >
                      <FormControlLabel
                        value={model.name}
                        control={<Radio />}
                        label={
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" fontWeight="bold">
                                {model.name}
                              </Typography>
                            }
                            secondary={
                              <Grid container spacing={1}>
                                <Grid>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    <b>Model:</b> {model.model}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    <b>Modified:</b>{" "}
                                    {new Date(
                                      model.modified_at
                                    ).toLocaleString()}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    <b>Size:</b>{" "}
                                    {(
                                      model.size /
                                      (1024 * 1024 * 1024)
                                    ).toFixed(2)}{" "}
                                    GB
                                  </Typography>
                                </Grid>
                                <Grid>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    <b>Param Size:</b>{" "}
                                    {model.details?.parameter_size}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    <b>Quantization:</b>{" "}
                                    {model.details?.quantization_level}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ wordBreak: "break-all" }}
                                  >
                                    <b>Digest:</b> {model.digest}
                                  </Typography>
                                </Grid>
                              </Grid>
                            }
                          />
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </RadioGroup>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={!selectedModel}
                sx={{ mt: 2 }}
              >
                Save
              </Button>
            </CardContent>
          </Card>
        )}
      </DialogContent>

      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        message="JSON copied to clipboard!"
      />
    </Dialog>
  );
};

export default TagsList;
