import {
  Container,
  Typography,
  Card,
  CardContent,
  IconButton,
  Box,
  Divider,
  TextField,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { MessageBubble } from "./MessageBubble";

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { sender: "bot", isCode: false, text: "Hi! How can I help you today?" },
  ]);

  const [disableSend, setDisableSend] = useState(false);
  const [input, setInput] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const fetchResponse = useCallback((prompt: string) => {
    return (async (): Promise<string> => {
      try {
        const response = await axios.post("http://127.0.0.1:8000/generate", {
          prompt: prompt,
          model: localStorage.getItem("selectedModel"),
        });
        const data = await response.data;
        return data.generated_code as string;
      } catch (error) {
        console.error("Error:", error);
        return "⚠️ Error generating response";
      }
    })();
  }, []);

  const handleSend = useCallback(async () => {
    if (input.trim() === "") return;
    setDisableSend(true);

    const generateResponse = await fetchResponse(input.trim());

    setMessages((prev) => [
      ...prev,
      { sender: "user", isCode: false, text: input },
      { sender: "bot", isCode: true, text: generateResponse },
    ]);

    setInput("");
    setDisableSend(false);
  }, [input, fetchResponse]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        height: "90vh",
        display: "flex",
        flexDirection: "column",
        py: 2,
      }}
    >
      <Card sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Typography variant="h4" gutterBottom>
            OpenPilot
          </Typography>
          <Typography variant="body2" sx={{ mb: 1, color: "darkseagreen" }}>
            ({localStorage.getItem("selectedModel") || "default"})
          </Typography>
          <Typography variant="body1">
            An open-source, local-first code assistant powered by LLMs.
          </Typography>
          <Divider sx={{ my: 1 }} />

          {/* Messages Section */}
          <Box
            sx={{
              flexGrow: 1,
              p: 2,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                justifyContent: "flex-end",
              }}
            >
              {messages.map((msg, idx) => (
                <MessageBubble key={`${msg.sender}-${idx}`} msg={msg} />
              ))}
              <div ref={bottomRef} /> {/* auto-scroll target */}
            </Box>
          </Box>

          {/* Input Section */}
          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              disabled={disableSend}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={disableSend}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
