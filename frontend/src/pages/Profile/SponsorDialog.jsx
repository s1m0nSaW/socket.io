import { Avatar, Badge, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Slide, Stack, Typography } from '@mui/material'
import React from 'react'

import MonetizationOnSharpIcon from '@mui/icons-material/MonetizationOnSharp';
import PersonIcon from '@mui/icons-material/Person';

import axios from '../../axios.js'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const SponsorDialog = ({ open, handleClose, onSuccess, user }) => {
    
    const updateUser = async ( paymentId, status, count ) => {
        const fields = {
            paymentId,
            status,
            type: 'sponsor',
            count: count,
        };
        await axios
            .patch(`/payment`, fields)
            .catch((err) => console.log(err));
    };

    const handleBuyRsvp = async ( amount, count ) => {
        const date = +new Date()
        
        const fields = {
            id: user._id,
            price: amount,
            idempotenceKey: date,
        };

        await axios
            .post(`/create-payment`, fields)
            .then((data) => {
                if (data.data.confirmation.confirmation_url) {
                    updateUser(
                        data.data.id,
                        data.data.status,
                        count,
                    );
                    window.location.href = data.data.confirmation.confirmation_url
                } else {
                    onSuccess('Непредвиденная ошибка при оплате', 'error')
                }
            })
            .catch((err) => {
                console.log(err);
                onSuccess('Непредвиденная ошибка при оплате', 'error')
            });
        
    }

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>Стать спонсором</DialogTitle>
            {user && <DialogContent>
                <Stack sx={{ height: 150, width:'100%' }} justifyContent='center' alignItems='center'>
                    <Badge
                        sx={{margin:'10px'}}
                        overlap='circular'
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        badgeContent={<MonetizationOnSharpIcon fontSize='small' color="primary" sx={{ backgroundColor:'white', borderRadius:'50%'}}/>}
                    >
                        {user.pic === "none" ? (
                            <Avatar>
                                <PersonIcon />
                            </Avatar>
                        ) : (
                            <Avatar
                                alt={user.nickname}
                                src={`http://localhost:5000${user.pic}`}
                                sx={{ width: 86, height: 86}}
                            />
                        )}
                    </Badge>
                </Stack>
                <Typography variant='body2'>
                Став спонсором Вы:<br/><br/>
                - поможете <b>ochem.ru</b> стать лучше<br/>
                - получите <b>знак спонсора</b> на аватар<br/>
                - получите <b>10 rsvp</b> ежедневно
                </Typography>
            </DialogContent>}
            <DialogContent>
                <Stack spacing={1}>
                    <Button fullWidth variant='contained' onClick={()=>handleBuyRsvp(1990, 77760000000)}>Ежегодно 1990,00 ₽ в год (-44%)</Button>
                    <Button fullWidth variant='contained' onClick={()=>handleBuyRsvp(299, 2592000000)}>Ежемесячно 299,00 ₽ в месяц (30 дней)</Button>
                </Stack>
            </DialogContent>
            {user && user.invited !== null && <DialogContent>
                <Paper sx={{padding:'10px', borderColor:'red'}} variant="outlined">
                    <Typography align='center' variant='body2'>
                        <b>До 29 февраля 2024</b><br/>Пригласи <b>{10 - user.invited}</b> Друзей и получи статус спонсора на <b>30 дней БЕСПЛАТНО</b>.
                    </Typography>
                </Paper>
            </DialogContent>}
            <DialogActions>
                <Button onClick={handleClose}>Отмена</Button>
            </DialogActions>
        </Dialog>
    );
}

export default SponsorDialog