import ChatWindow from './components/ChatWindow/ChatWindow'
import Settings from './components/Settings/Settings';
import TagsList from './components/ModelChooser/TagsList';
import SettingsIcon from "@mui/icons-material/Settings";
import ListIcon from '@mui/icons-material/List';
import Fab from "@mui/material/Fab";
import axios from 'axios';

import './App.css'
import { useState } from 'react';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isModelsOpen, setIsModelsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleTrain = async (data: { mode: "git" | "local"; value: string }) => {
    try {
      setLoading(true);
      setIsSettingsOpen(false);
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
        onClick={() => setIsSettingsOpen(true)} 
        disabled={loading}
        >
        <SettingsIcon />
      </Fab>
      <Fab
        color="primary"
        aria-label="models"
        size="small"
        sx={{
            position: "absolute",
            top: 60,
            right: 8,
        }}
        onClick={() => setIsModelsOpen(true)} 
        disabled={loading}
        >
        <ListIcon />
      </Fab>
      <ChatWindow/>
      <Settings 
        open={isSettingsOpen} 
        onSave={handleTrain} 
        onClose={() => { setIsSettingsOpen(false) }} />
      <TagsList 
        open={isModelsOpen} 
        onClose={() => { setIsModelsOpen(false) }} 
        onSave={(selectedModel) => { localStorage.setItem("selectedModel", selectedModel);}} />
    </>
  )
}

export default App
