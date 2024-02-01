import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, Stack, Typography } from '@mui/material'
import React from 'react'
import axios from '../../axios.js'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const BuyRsvpDialog = ({ open, handleClose, onSuccess, user }) => {

    const showAd = () => {
        if (window.yaContextCb && typeof window.yaContextCb.push === 'function') {
            window.yaContextCb.push(() => {
                window.Ya.Context.AdvManager.render({
                    "blockId": "R-A-5706352-1",
                    "type": "rewarded",
                    "platform": "touch",
                    onRewarded: (isRewarded) => {
                        if (isRewarded) {
                            console.log('условие получения награды выполнено')
                        } else {
                            console.log('условие получения награды не выполнено')
                        }
                    }
                });
            });
        }
    };
    
    const updateUser = async ( paymentId, status, count ) => {
        const fields = {
            paymentId,
            status,
            type: 'retail',
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
            <script>window.yaContextCb=window.yaContextCb||[]</script>
            <script src="https://yandex.ru/ads/system/context.js" async></script>
            
            <DialogTitle>Купить RSVP</DialogTitle>
            <DialogContent>
                <Typography variant='body2'>Меньше 10 рублей за игру</Typography>
            </DialogContent>
            <DialogContent>
                <Stack spacing={1}>
                    <Button fullWidth variant='contained' onClick={()=>handleBuyRsvp(99, 10)}>Купить 10 RSVP за 99 ₽</Button>
                    <Button fullWidth variant='contained' onClick={()=>handleBuyRsvp(199, 30)}>Купить 30 RSVP за 199 ₽</Button>
                    <Button fullWidth variant='contained' onClick={()=>handleBuyRsvp(499, 100)}>Купить 100 RSVP за 499 ₽</Button>
                </Stack>
            </DialogContent>
            <DialogContent>
                <Stack spacing={1}>
                    <Button fullWidth variant='contained' onClick={()=>showAd()}>Смотреть рекламу за 1 RSVP </Button>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Отмена</Button>
            </DialogActions>
        </Dialog>
    );
}

export default BuyRsvpDialog