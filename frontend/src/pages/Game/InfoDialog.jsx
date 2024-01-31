import { Button, CardContent, CardMedia, Dialog, DialogActions, Stack, Typography, Slide } from "@mui/material";
import React from "react";

import AccountCircle from '@mui/icons-material/AccountCircle';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const InfoDialog = ({ open, friend, handleClose }) => {
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
                image={`https://ochem.ru${friend.pic}`}
            />}
            <CardContent>
                <Typography variant="caption">{friend.nickname}</Typography>
                <Typography gutterBottom variant="h6">
                {friend.fullname === "none"
                                            ? "Имя не указано"
                                            : friend.fullname}
                </Typography>
                {friend.profileStatus !== 'none' && <Typography variant="body2"><i>"{friend.profileStatus}"</i></Typography>}
                {friend.friends && <Typography gutterBottom variant="body1">{friend.friends.length} друзей</Typography>}
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
            <DialogActions>
                <Button size="small" onClick={handleClose}>Отмена</Button>
            </DialogActions>
        </Dialog>
    );
};

export default InfoDialog;
