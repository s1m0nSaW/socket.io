import { AppBar, Box, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";

import { selectIsAuth, logout } from "../redux/slices/auth";

import MoreVertIcon from '@mui/icons-material/MoreVert';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InfoIcon from '@mui/icons-material/Info';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CopyToClipboard from 'react-copy-to-clipboard'

const Header = ({ profile, onSuccess }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuth = useSelector(selectIsAuth);
    const user = useSelector((state) => state.auth.data);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleNav = (link) => {
        navigate(link);
        setAnchorEl(null);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onLinkCopy = () => {
        onSuccess('Ссылка скопирована в буфер обмена', 'success')
    }

    const onClickLogout = () => {
        if (window.confirm("Вы действительно хотите выйти?")) {
            dispatch(logout());
            window.localStorage.removeItem("token");
        }
    };

    return (
        <Box sx={{ width: "100%" }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h5"
                        component="div"
                        sx={{ flexGrow: 1, marginTop: "10px" }}
                        onClick={() => handleNav("/main")}
                    >
                        Ochem!
                    </Typography>
                    <IconButton
                        size="large"
                        edge="end"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleMenu}
                    >
                        <MoreVertIcon />
                    </IconButton>

                    {!isAuth ? (
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem
                                sx={{ fontSize: "14px" }}
                                onClick={() => handleNav("/logi")}
                            >
                                <ListItemIcon>
                                    <LoginIcon />
                                </ListItemIcon>
                                <ListItemText>Вход</ListItemText>
                            </MenuItem>
                            <MenuItem
                                sx={{ fontSize: "14px" }}
                                onClick={() => handleNav(`/info`)}
                            >
                                <ListItemIcon>
                                    <InfoIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Информация</ListItemText>
                            </MenuItem>
                        </Menu>
                    ) : (
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            {profile ? <MenuItem
                                sx={{ fontSize: "14px" }}
                                onClick={() =>
                                    handleNav(`/prfl/${user.nickname}`)
                                }
                            >
                                <ListItemIcon>
                                    <AccountCircleIcon />
                                </ListItemIcon>
                                <ListItemText>Профиль</ListItemText>
                            </MenuItem>:
                            <CopyToClipboard text={`https://ochem.ru/${user.nickname}`}>
                            <MenuItem sx={{ fontSize: "14px" }} onClick={()=>onLinkCopy()}>
                                <ListItemIcon>
                                    <ContentCopyIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Реферальная ссылка</ListItemText>
                            </MenuItem></CopyToClipboard>}
                            <MenuItem
                                sx={{ fontSize: "14px" }}
                                onClick={() => handleNav(`/info`)}
                            >
                                <ListItemIcon>
                                    <InfoIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Информация</ListItemText>
                            </MenuItem>
                            <MenuItem
                                sx={{ fontSize: "14px" }}
                                onClick={onClickLogout}
                            >
                                <ListItemIcon>
                                    <LogoutIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Выход</ListItemText>
                            </MenuItem>
                        </Menu>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Header;
