import { Box, Typography, IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export function MessageBubble({ msg }: { msg: { sender: string; text: string } }) {
  const isUser = msg.sender === "user";

  // --- Split description & code ---
  const codeRegex = /```(?:\w+)?\n([\s\S]*?)```/;
  const match = msg.text.match(codeRegex);
  const description = msg.text.replace(codeRegex, "").trim();
  const code = match ? match[1] : null;

  const copyToClipboard = () => {
    if (code) navigator.clipboard.writeText(code);
  };

  return (
    <Box
      alignSelf={isUser ? "flex-end" : "flex-start"}
      bgcolor={isUser ? "primary.main" : "grey.200"}
      color={isUser ? "white" : "black"}
      px={2}
      py={1}
      borderRadius={2}
      maxWidth="80%"
      sx={{ whiteSpace: "pre-wrap" }}
    >
      {/* Description */}
      {description && (
        <Typography variant="body2" mb={code ? 1 : 0}>
          {description}
        </Typography>
      )}

      {/* Code Block with Copy */}
      {code && (
        <Box position="relative">
          <SyntaxHighlighter
            language="python" // change based on model response or detect dynamically
            style={materialDark}
            customStyle={{ borderRadius: "8px", padding: "12px" }}
          >
            {code}
          </SyntaxHighlighter>
          <IconButton
            size="small"
            onClick={copyToClipboard}
            sx={{ position: "absolute", top: 4, right: 4, color: "white" }}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
