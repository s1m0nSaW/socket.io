import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, Stack } from '@mui/material'
import React from 'react'
import axios from '../../axios.js'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const BuyRsvpDialog = ({ open, handleClose, onSuccess, user }) => {
    
    const updateUser = async ( paymentId, status ) => {
        const fields = {
            paymentId,
            status,
        };
        await axios
            .patch(`/payment`, fields)
            .catch((err) => console.log(err));
    };

    const handleBuyRsvp = async ( amount ) => {
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
            <DialogTitle>Купить RSVP</DialogTitle>
            <DialogContent>
                <Stack spacing={1}>
                    <Button fullWidth variant='contained' onClick={()=>handleBuyRsvp(99)}>Купить 10 RSVP за 99 ₽</Button>
                    <Button fullWidth variant='contained' onClick={()=>handleBuyRsvp(199)}>Купить 30 RSVP за 199 ₽</Button>
                    <Button fullWidth variant='contained' onClick={()=>handleBuyRsvp(499)}>Купить 100 RSVP за 499 ₽</Button>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Отмена</Button>
            </DialogActions>
        </Dialog>
    );
}

export default BuyRsvpDialog