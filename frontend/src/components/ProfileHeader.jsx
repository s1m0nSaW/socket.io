import { Avatar, Box, IconButton, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Typography } from "@mui/material";
import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";

import MoreVertIcon from '@mui/icons-material/MoreVert';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import CheckIcon from '@mui/icons-material/Check';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CurrencyRubleIcon from '@mui/icons-material/CurrencyRuble';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CopyToClipboard from 'react-copy-to-clipboard'

import { logout } from '../redux/slices/auth.js';
import EditRequisDialog from "../components/EditRequisDialog.jsx";
import EditInfoDialog from "../components/EditInfoDialog.jsx";
import PartnerDialog from "./PartnerDialog.jsx";
import SuccessSnack from "../components/SuccessSnack.jsx";
import axios from '../axios.js';

const ProfileHeader = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.data);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openRequisDialog, setOpenRequisDialog] = React.useState(false);
    const [partnerDialog, setPartnerDialog] = React.useState(false);
    const [editInfo, setEditInfo] = React.useState(false);
    const [successSnack, setSuccessSnack] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');
    const [severity, setSeverity] = React.useState('info');

    const [idempotenceKey, setIdempotenceKey] = React.useState(Date.now());

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSuccessOpen = (message, severity) => {
        setSuccessMessage(message);
        setSeverity(severity);
        setSuccessSnack(true);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleCloseRequisDialog = () => {
        setOpenRequisDialog(false);
    };

    const openPartnerDialog = () => {
        if(user.partner === 'no'){
            setPartnerDialog(true);
        } else {
            handleSuccessOpen('Вы уже отправили заявку', 'info');
        };
    };

    const handleClosePartnerDialog = () => {
        setPartnerDialog(false);
    };

    const handleCloseEditInfo = () => {
        setEditInfo(false);
    };

    const onClickLogout = () => {
            if (window.confirm('Вы действительно хотите выйти?')) {
            dispatch(logout());
            window.localStorage.removeItem('token');
            navigate('/');
        };
    };

    const onLinkCopy = () => {
        setSuccessMessage("Ссылка скопирована")
        setSeverity("info")
        setSuccessSnack(true)
    }

    const handleSuccessClose = () => {
        setSuccessSnack(false)
    }

    const updateUser = async ( paymentId, status ) => {
        const fields = {
            paymentId,
            status,
        };
        await axios
            .patch(`/payment`, fields)
            .catch((err) => console.log(err));
    };

    const createPayment = async () => {
        if (window.confirm(`Оплатить 1990 рублей за полный доступ к сервису?`)) {
            setIdempotenceKey(Date.now());
            const fields = {
                id: user._id,
                price: 1990,
                idempotenceKey: idempotenceKey,

            };

            await axios
                .post(`/create-payment`, fields)
                .then((data) => {
                    if (data.data.confirmation.confirmation_url) {
                        updateUser(
                            data.data.id,
                            data.data.status,
                        );
                        window.location.href = data.data.confirmation.confirmation_url
                    } else {
                        return alert("Непредвиденная ошибка с оплатой");
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    return (
        <Box sx={{ width: "100vw", padding: "10px", backgroundColor: "black" }}>
            <ListItem
                secondaryAction={
                    <IconButton
                        edge="end"
                        aria-label="delete"
                        aria-haspopup="true"
                        onClick={handleMenu}
                    >
                        <MoreVertIcon />
                    </IconButton>
                }
            >
                <ListItemAvatar>
                    <Avatar>
                        {user?.paymentStatus === "succeeded" ? (
                            <CheckIcon color="success" />
                        ) : (
                            <MoneyOffIcon />
                        )}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <Typography variant="h6" sx={{ color: "white" }}>
                            {user?.fullname}
                        </Typography>
                    }
                    secondary={
                        <Typography sx={{ color: "white" }}>
                            <br />
                            Баланс: {user?.balance} ₽
                        </Typography>
                    }
                />
            </ListItem>
            {user?.paymentStatus !== "succeeded" && 
            <Paper sx={{ paddingLeft:'10px'}} onClick={()=>createPayment()}>
                <Typography variant="caption" sx={{ color: "red" }} >Для полного доступа необходимо оплатить</Typography>
            </Paper>}
            <Menu
                MenuListProps={{ style: { backgroundColor: "#141414" } }}
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
                onClose={handleMenuClose}
            >
                {user?.paymentStatus === "succeeded" &&
                <MenuItem sx={{ fontSize: "14px" }} onClick={openPartnerDialog}>
                    <ListItemIcon>
                        <HandshakeIcon fontSize="small" />
                    </ListItemIcon>
                    Стать продавцом
                </MenuItem>}
                {user?.paymentStatus === "succeeded" &&
                <MenuItem sx={{ fontSize: "14px" }} onClick={()=>setOpenRequisDialog(true)}>
                    <ListItemIcon>
                        <CreditCardIcon fontSize="small" />
                    </ListItemIcon>
                    Реквизиты
                </MenuItem>}
                {user?.paymentStatus === "succeeded" &&
                <MenuItem sx={{ fontSize: "14px" }} onClick={()=>setEditInfo(true)}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    Редактировать профиль
                </MenuItem>}
                {user?.paymentStatus === "succeeded" && <CopyToClipboard text={`https://communicationcompass.ru/${user.nickname}`}>
                <MenuItem sx={{ fontSize: "14px" }} onClick={()=>onLinkCopy()}>
                    <ListItemIcon>
                        <ContentCopyIcon fontSize="small" />
                    </ListItemIcon>
                    Реферальная ссылка
                </MenuItem></CopyToClipboard>}
                {user?.paymentStatus !== "succeeded" &&
                <MenuItem sx={{ fontSize: "14px" }} onClick={()=>createPayment()}>
                    <ListItemIcon>
                        <CurrencyRubleIcon fontSize="small" />
                    </ListItemIcon>
                    Оплата
                </MenuItem>}
                <MenuItem sx={{ fontSize: "14px" }} onClick={()=>onClickLogout()}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Выход
                </MenuItem>
            </Menu>
            <EditRequisDialog open={openRequisDialog} handleClose={handleCloseRequisDialog} onSuccess={handleSuccessOpen} user={user}/>
            <PartnerDialog open={partnerDialog} handleClose={handleClosePartnerDialog} onSuccess={handleSuccessOpen}/>
            <EditInfoDialog open={editInfo} handleClose={handleCloseEditInfo} onSuccess={handleSuccessOpen} user={user}/>
            <SuccessSnack open={successSnack} handleClose={handleSuccessClose} message={successMessage} severity={severity}/> 
        </Box>
        
    );
}

export default ProfileHeader;