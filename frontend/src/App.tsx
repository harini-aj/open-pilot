import ChatWindow from './components/ChatWindow/ChatWindow'
import Settings from './components/Settings/Settings';
import SettingsIcon from "@mui/icons-material/Settings";
import Fab from "@mui/material/Fab";
import axios from 'axios';

import './App.css'
import { useState } from 'react';

function App() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleTrain = async (data: { mode: "git" | "local"; value: string }) => {
    try {
      setLoading(true);
      setOpen(false);
      const res = await axios.post("http://127.0.0.1:8000/train", data);
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Error starting training.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Fab
        color="primary"
        aria-label="settings"
        size="small"
        sx={{
            position: "absolute",
            top: 8,
            right: 8,
        }}
        onClick={() => setOpen(true)} 
        disabled={loading}
        >
        <SettingsIcon />
      </Fab>
      <ChatWindow/>
      <Settings 
        open={open} 
        onSave={handleTrain} 
        onClose={() => { setOpen(false) }} />
    </>
  )
}

export default App
