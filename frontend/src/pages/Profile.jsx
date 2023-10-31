import { Backdrop, BottomNavigation, BottomNavigationAction, CircularProgress, Grid, Paper } from '@mui/material';
import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import NewspaperIcon from '@mui/icons-material/Newspaper';

import Home from './Fragments/Home.jsx';
import News from './Fragments/News.jsx';
import Account from './Fragments/Account.jsx';
import Finance from './Fragments/Finance.jsx';
import Cart from './Fragments/Cart.jsx';
import SuccessSnack from '../components/SuccessSnack.jsx';
import { selectIsAuth, authStatus } from '../redux/slices/auth.js';
import ProfileHeader from '../components/ProfileHeader.jsx';

export const Profile = () => {
  const navigate = useNavigate()
  const isAuth = useSelector(selectIsAuth)
  const status = useSelector(authStatus)
  const user = useSelector((state) => state.auth.data)
  const [value, setValue] = React.useState(2);
  const [disabled, setDisabled] = React.useState(true);
  const [snackMessage, setSnackMessage] = React.useState('');
  const [snack, setSnack] = React.useState(false);
  const [severity, setSeverity] = React.useState('info');
  const [backdrop, setBackdrop] = React.useState(true);

  const handleSnackClose = () => {
    setSnack(false)
  }

  React.useEffect(()=>{
    if(status !== 'loading'){
      setBackdrop(false)
      if (!isAuth) {
          navigate(`/`);
      }
    } else {
      setBackdrop(true)
    }
    if (user?.paymentStatus === "succeeded"){
      setDisabled(false)
    }
  },[user, status, isAuth, navigate])

  return (
    <Grid container>
      <ProfileHeader/>
      {value===0&&<Home/>}
      {value===1&&<News/>}
      {value===2&&<Account/>}
      {value===3&&<Finance/>}
      {value===4&&<Cart/>}
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            if(disabled === true){
              setSeverity('error')
              setSnackMessage('Аккаунт не оплачен')
              setSnack(true)
            } else {
              setValue(newValue);
            }
          }}
        >
          <BottomNavigationAction icon={<HomeIcon />} />
          <BottomNavigationAction icon={<NewspaperIcon />} />
          <BottomNavigationAction icon={<AccountBoxIcon />} />
          <BottomNavigationAction icon={<AccountBalanceWalletIcon />} />
          <BottomNavigationAction icon={<ShoppingCartIcon />} />
        </BottomNavigation>
      <SuccessSnack open={snack} handleClose={handleSnackClose} message={snackMessage} severity={severity}/>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, opacity: 1, backgroundColor:(theme) => theme.palette.common.black }}
        open={backdrop}
      >
        <CircularProgress color='primary' />
      </Backdrop>
      </Paper>
    </Grid>
  )
}

