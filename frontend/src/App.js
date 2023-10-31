import React from 'react';
import Container from "@mui/material/Container";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Info } from './pages/Info';

import { Login, Main, Profile, Admin } from "./pages";
import { fetchAuthMe } from "./redux/slices/auth";
import { Typography, Link, Snackbar, Button } from '@mui/material';



function App() {
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);

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

  React.useEffect(() => {
    dispatch(fetchAuthMe());
    const cookies = window.localStorage.getItem('cookies')
    if(cookies !== 'accepted' || !cookies){
      setOpen(true)
    }
  }, [dispatch]);

  return (
    <React.Fragment>
      
      <Container disableGutters maxWidth="lg" sx={{ minHeight: '100vh', width:'100vw' }}>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/:referal" element={<Main />} />
          <Route path="/lk/:nickname" element={<Profile />} />
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
    </React.Fragment>
  );
}

export default App;
