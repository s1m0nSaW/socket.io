import React from 'react';
import Container from "@mui/material/Container";
import { Route, Routes, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { io } from 'socket.io-client';

import { Info } from './pages/Info';

import { Login, Main, Profile, Admin } from "./pages";
import { fetchAuthMe } from "./redux/slices/auth";
import { Typography, Link, Snackbar, Button } from '@mui/material';
import Intro from './pages/Intro';
import Friends from './pages/Friends';
import GamePage from './pages/Game';
import Games from './pages/Games';
import SuccessSnack from './components/SuccessSnack';

//const socket = io.connect('http://localhost:5000');
const socket = io("https://ochem.ru/api/", {
  withCredentials: true,
  transports: ["polling","websocket"]
});

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const [successSnack, setSuccessSnack] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');
  const [severity, setSeverity] = React.useState('info');

  const handleClose = (event, reason) => {
    window.localStorage.setItem('cookies', 'accepted')
    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        OK
      </Button>
    </React.Fragment>
  );

  const handleSuccessClose = () => {
    setSuccessSnack(false);
  };

  React.useEffect(() => {
    dispatch(fetchAuthMe());
    const cookies = window.localStorage.getItem('cookies')
    if(cookies !== 'accepted' || !cookies){
      setOpen(true)
    }
  }, [dispatch]);

  React.useEffect(() => {
    const handleSuccessOpen = (message, severity) => {
      setSuccessMessage(message);
      setSeverity(severity);
      setSuccessSnack(true);
    };

    socket.on("notification", ({ data }) => {
      if(location) {
        if (location.pathname.includes('/game/')) {
          return null;
        } else {
          handleSuccessOpen(data.message, data.severity);
        }
      }
    });
  },[location]);

  return (
    <React.Fragment>
      <Container disableGutters maxWidth="lg" sx={{ minHeight: '100vh', width:'100vw' }}>
        <Routes>
          <Route path="/" element={<Intro/>} />
          <Route path="/:referal" element={<Intro />} />
          <Route path="/main" element={<Main />} />
          <Route path="/fnds" element={<Friends socket={socket}/>} />
          <Route path="/main/:referal" element={<Main />} />
          <Route path="/prfl/:nickname" element={<Profile socket={socket} />} />
          <Route path="/game/:id" element={<GamePage socket={socket}/>} />
          <Route path="/gams" element={<Games socket={socket}/>} />
          <Route path="/logi" element={<Login />} />
          <Route path="/info" element={<Info />} />
          <Route path="/admi" element={<Admin />} />
        </Routes>
      </Container>
      <Snackbar
        anchorOrigin={{vertical: 'bottom',
        horizontal: 'center',}}
        open={open}
        onClose={handleClose}
        message={<Typography>Мы используем cookie. Продолжая использовать сайт, Вы даете свое согласие на использование cookie для хранения данных. <Link href="/info">Подробнее</Link></Typography>}
        action={action}
      />
      <SuccessSnack
                open={successSnack}
                handleClose={handleSuccessClose}
                message={successMessage}
                severity={severity}
            />
    </React.Fragment>
  );
}

export default App;
