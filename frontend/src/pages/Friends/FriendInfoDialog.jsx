import { Button, CardContent, CardMedia, Dialog, DialogActions, Slide, Stack, Typography } from "@mui/material";
import React from "react";

import axios from '../../axios.js'

import AccountCircle from '@mui/icons-material/AccountCircle';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const FriendInfoDialog = ({ open, onSuccess, handleClose, friend, page }) => {

    const removeFriend = async () => {
        await axios.delete(`/friends/${friend._id}`)
        .then(()=>{
            onSuccess('Пользователь удален из списка друзей', 'success');
            handleClose();
        })
        .catch((err)=>{
            console.warn(err);
            onSuccess('Не удалось удалить пользователя из списка друзей', 'error');
            handleClose();
        });
    }

    const confirmRequest = async () => {
        await axios.get(`/conf-req/${friend._id}`)
        .then(()=>{
            onSuccess('Пользователь добавлен в список друзей', 'success');
            handleClose();
        })
        .catch((err)=>{
            console.warn(err);
            onSuccess('Не удалось добавить пользователя в список друзей', 'error');
            handleClose();
        });
    }

    const rejectRequest = async () => {
        await axios.get(`/reject-req/${friend._id}`)
        .then(()=>{
            onSuccess('Заявка отклонена', 'success');
            handleClose();
        })
        .catch((err)=>{
            console.warn(err);
            onSuccess('Не удалось отклонить заявку', 'error');
            handleClose();
        });
    }

    const deleteRequest = async () => {
        await axios.delete(`/request/${friend._id}`)
        .then(()=>{
            onSuccess('Заявка удалена', 'success');
            handleClose();
        })
        .catch((err)=>{
            console.warn(err);
            onSuccess('Не удалось удалить заявку', 'error');
            handleClose();
        });
    }

    return (
        <Dialog
            fullWidth
            maxWidth={'xs'}
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
        >
            {friend.pic === 'none'?
                <Stack sx={{ height: 150, width:'100%' }} justifyContent='center' alignItems='center'>
                    <AccountCircle color="disabled" sx={{ fontSize: 80 }} />
                </Stack>:
                <CardMedia
                sx={{ height: 300 }}
                image={`http://localhost:5000${friend.pic}`}
            />}
            <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                {friend.fullname === "none"
                                            ? "Имя не указано"
                                            : friend.fullname}
                </Typography>
                <Typography variant="body2">
                    {friend.age === "none"
                        ? "Возраст не указан"
                        : friend.age}<br/>
                    {friend.gender === "none"
                        ? "Пол не указан"
                        : friend.gender}
                </Typography>
                <Typography variant="caption">
                    {friend.city === "none"
                        ? "Город не указан"
                        : friend.city}
                </Typography>
            </CardContent>
            {page === 'main' && <DialogActions>
                <Button size="small" onClick={removeFriend}>Удалить из друзей</Button>
                <Button size="small" onClick={handleClose}>Отмена</Button>
            </DialogActions>}
            {page === 'reqIn' && <DialogActions>
                <Button size="small" onClick={confirmRequest}>Принять</Button>
                <Button size="small" onClick={rejectRequest}>Отклонить</Button>
                <Button size="small" onClick={handleClose}>Отмена</Button>
            </DialogActions>}
            {page === 'reqOut' && <DialogActions>
                <Button size="small" onClick={deleteRequest}>Удалить</Button>
                <Button size="small" onClick={handleClose}>Отмена</Button>
            </DialogActions>}
        </Dialog>
    );
};

export default FriendInfoDialog;
