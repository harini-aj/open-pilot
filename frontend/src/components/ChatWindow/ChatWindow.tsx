import { Container, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Box, 
  Divider, 
  IconButton, 
  Paper, 
  TextField } from '@mui/material'
import { useCallback, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { MessageBubble } from './MessageBubble';

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! How can I help you today?' },
  ]);

  const [input, setInput] = useState('');

  const fetchResponse = useCallback((prompt: string) => {
    return (async ():Promise<string> => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/generate', {
          prompt: prompt,
        });
        const data = await response.data
        return data.generated_code as string
      } catch (error) {
        console.error('Error:', error);
        return error as string
      }
    })()
  }, [])

  const handleSend = useCallback(async () => {
    debugger;
    if (input.trim() === '') return;
    let generateResponse = await fetchResponse(input.trim())
    setMessages(prev =>  [...prev, { sender: 'user', text: input }, {sender: 'bot', text: generateResponse}]);
    setInput('');
  }, [input, messages, setMessages, setInput])

  return (
    <Container maxWidth="lg" sx={{
      height: '99vh',
      display: 'flex',
      flexDirection: 'column',
      py: 2,
    }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            OpenPilot
          </Typography>
          <Typography variant="body1">
            An open-source, local-first code assistant powered by LLMs.
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Box
            sx={{
              flexGrow: 1,
              p: 2,
              maxHeight: 'calc(100vh - 250px)',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {messages.map((msg, idx) => (
               <MessageBubble key={`${msg.sender}-${idx}`} msg={msg} />
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <IconButton color="primary" onClick={handleSend}>
              <SendIcon color='info' />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}