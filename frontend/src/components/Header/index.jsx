import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import LogoutIcon from '@mui/icons-material/Logout';

import { useSelector, useDispatch } from 'react-redux'
import { selectIsAuth, logout } from '../../redux/slices/auth.js';
import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { IconButton, Menu, MenuItem, Typography } from '@mui/material';

export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isAuth = useSelector(selectIsAuth);

  const handleNav = (link) => {
    navigate(link)
    setAnchorEl(null);
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClickLogout = () => {
    if (window.confirm('Вы действительно хотите выйти?')) {
    dispatch(logout());
    window.localStorage.removeItem('token');
    }
};

  return (
    <div className={styles.root}>
      <Container maxWidth="lg" sx={{width:'100vw'}} >
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <Typography variant="body1">CommunicationCompass</Typography>
          </Link>
              {!isAuth ? <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <MoreVertIcon sx={{ color:'white'}}/>
              </IconButton>
              <Menu
                MenuListProps={{ style: {backgroundColor:'#141414'}}}
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem sx={{fontSize:'14px'}} onClick={()=>handleNav("/logi")}>Вход</MenuItem>
              </Menu>
          </div>:<IconButton
                  onClick={onClickLogout}
                >
                  <LogoutIcon/>
                </IconButton>}
        </div>
      </Container>
    </div>
  );
};
