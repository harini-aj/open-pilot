import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Snackbar,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Editor from "@monaco-editor/react";

interface Message {
  sender: string;
  text: string;
  isCode: boolean;
}

export function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.sender === "user";
  const [copied, setCopied] = useState(false);

  // Remove model artifacts before showing
  function cleanText(text: string): string {
    return text
      .replace(/\[UNK_BYTE_[^\]]+\]/g, "") // remove UNK_BYTE tokens
      .replace(/<\|.*?\|>/g, ""); // remove <|fim_...|> tokens
  }

  function copyToClipboard(): void {
    navigator.clipboard.writeText(cleanText(msg.text));
    setCopied(true);
  }

  return (
    <Box
      alignSelf={isUser ? "flex-end" : "flex-start"}
      bgcolor={isUser ? "primary.main" : "grey.200"}
      color={isUser ? "white" : "black"}
      px={2}
      py={1}
      borderRadius={2}
      display={isUser ? "inline-block" : "flex"}
      width={isUser ? "auto" : msg.isCode ? "100%" : "auto"}
      height={isUser ? "auto" : "100%"}
      maxWidth="80%"
      sx={{ whiteSpace: "pre-wrap", textAlign: "left" }}
    >
      {/* User message */}
      {!msg.isCode && (
        <Typography variant="body2">
          {msg.text}
        </Typography>
      )}

      {/* Model (assistant) message */}
      {msg.isCode && (
        <Box position="relative" flex={1}>
          <Editor
            width="100%"
            defaultLanguage="typescript"
            value={cleanText(msg.text)}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              wordWrap: "on",
              scrollBeyondLastLine: false,
              lineNumbers: "off",
              folding: false,
              glyphMargin: false,
              renderLineHighlight: "none",
            }}
            onMount={(editor: import("monaco-editor").editor.IStandaloneCodeEditor) => {
              const updateHeight = (): void => {
                const height: number = Math.min(editor.getContentHeight(), 300);
                editor.layout({
                  width: editor.getLayoutInfo().width,
                  height,
                });
              };
              updateHeight();
              editor.onDidContentSizeChange(updateHeight);
            }}
          />

          <IconButton
            size="small"
            onClick={copyToClipboard as React.MouseEventHandler<HTMLButtonElement>}
            sx={{ position: "absolute", top: 4, right: 4, color: "white" }}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Copy confirmation */}
      <Snackbar
        open={copied}
        autoHideDuration={1500}
        onClose={() => setCopied(false)}
        message="Copied!"
      />
    </Box>
  );
}
