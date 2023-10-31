import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, Stack, TextField } from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { fetchAuthMe } from '../redux/slices/auth.js'
import axios from '../axios.js'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const PartnerDialog = ({ open, handleClose, onSuccess }) => {
    const dispatch = useDispatch()

    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        defaultValues: {
            name: '',
            phone: '',
            mail: '',
            status: '',
            shopName: '',
            city: '',
            product: '',
            count: '',
            website: '',
        },
        mode: 'onChange',
    });

    const onPartner = async () => {
        await axios.get('/auth/partner').catch(err => console.warn(err))
    }

    const onSubmit = async (values) => {
        await axios.post(`/partner`,values).then((data) => {
            if(data){
                onSuccess('Заявка на партнерство принята', 'success')
                onPartner()
                dispatch(fetchAuthMe())
            }
        }).catch((err)=>{
            if(err) onSuccess('Фатальная ошибка', 'error')
        });
        handleClose()
    };

    return (
        <Dialog
            fullScreen
            PaperProps={{ style: { backgroundColor: "#141414", width:'100vw' } }}
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>Редактировать</DialogTitle>
            <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} sx={{marginTop:'10px'}}>
                <TextField
                label="ФИО"
                error={Boolean(errors.name?.message)}
                helperText={errors.name?.message}
                {...register('name', { required: "Напишите ФИО" })}
                fullWidth />
                <TextField
                label="Номер телефона"
                error={Boolean(errors.phone?.message)}
                helperText={errors.phone?.message}
                {...register('phone', { required: "Напишите номер телефона" })}
                fullWidth />
                <TextField
                label="E-mail"
                error={Boolean(errors.mail?.message)}
                helperText={errors.mail?.message}
                {...register('mail', { required: "Напишите E-mail" })}
                fullWidth />
                <TextField
                label="Налоговый статус"
                error={Boolean(errors.status?.message)}
                helperText={errors.status?.message}
                {...register('status', { required: "Напишите налоговый статус" })}
                fullWidth />
                <TextField
                label="Название магазина"
                error={Boolean(errors.shopName?.message)}
                helperText={errors.shopName?.message}
                {...register('shopName', { required: "Напишите название магазина" })}
                fullWidth />
                <TextField
                label="Город, где хранится товар"
                error={Boolean(errors.city?.message)}
                helperText={errors.city?.message}
                {...register('city', { required: "Напишите город" })}
                fullWidth />
                <TextField
                label="Что будете продавать"
                error={Boolean(errors.product?.message)}
                helperText={errors.product?.message}
                {...register('product', { required: "Напишите категорию товара" })}
                fullWidth />
                <TextField
                label="Сколько планируете продать"
                error={Boolean(errors.count?.message)}
                helperText={errors.count?.message}
                {...register('count', { required: "Напишите количество товара" })}
                fullWidth />
                <TextField
                label="Сайт, если есть"
                {...register('website')}
                fullWidth />
                <Button disabled={!isValid} type='submit' size="large" variant="contained" fullWidth>
                OK
                </Button>
                </Stack>
            </form>
                    
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                >
                    Отмена
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default PartnerDialog