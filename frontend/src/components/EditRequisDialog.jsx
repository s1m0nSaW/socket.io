import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, Slide, Stack, TextField, Typography } from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { fetchAuthMe } from '../redux/slices/auth.js'
import axios from '../axios.js'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const EditRequisDialog = ({ open, handleClose, onSuccess, user }) => {
    const [content, setContent] = React.useState('info')
    const dispatch = useDispatch()

    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        defaultValues: {
            userName: '',
            cardNumber: '',
            inn: '',
            bankName: '',
            bankNumber: '',
            bankBik: '',
            bankCorNumber: '',
        },
        mode: 'onChange',
    });

    const onCloseDialog = () => {
        setContent('info')
        handleClose()
    }

    const onSubmit = async (values) => {
        await axios.patch(`/requisites`,values).then((data) => {
            if(data){
                onSuccess('Реквизиты добавлены', 'success')
                setContent('info')
            }
        }).catch((err)=>{
            if(err) {
                onSuccess('Реквизиты не добавлены', 'error')
                setContent('info')
            }
        });
        dispatch(fetchAuthMe())
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
            {content === "info" ? <DialogTitle>Реквизиты</DialogTitle>:<DialogTitle>Редактировать</DialogTitle>}
            {content === "info" && 
            <List>
                <ListItem>
                    <ListItemText 
                        primary={<Typography variant='caption'>ФИО ПОЛУЧАТЕЛЯ<br/></Typography>} 
                        secondary={<Typography variant='body1'>
                        {Object.keys(user?.requisites.userName || {}).length > 0 ? user?.requisites.userName : 'Нет данных'}
                        </Typography>}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText 
                        primary={<Typography variant='caption'>НОМЕР КАРТЫ<br/></Typography>} 
                        secondary={<Typography variant='body1'>{Object.keys(user?.requisites.cardNumber || {}).length > 0 ? user?.requisites.cardNumber : 'Нет данных'}</Typography>}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText 
                        primary={<Typography variant='caption'>ИНН:<br/></Typography>} 
                        secondary={<Typography variant='body1'>
                        {Object.keys(user?.requisites.inn || {}).length > 0 ? user.requisites.inn : 'Нет данных'}
                        </Typography>}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText 
                        primary={<Typography variant='caption'>НАИМЕНОВАНИЕ БАНКА<br/></Typography>} 
                        secondary={<Typography variant='body1'>
                        {Object.keys(user?.requisites.bankName|| {}).length > 0 ? user?.requisites.bankName : 'Нет данных'}
                        </Typography>}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText 
                        primary={<Typography variant='caption'>НОМЕР СЧЁТА<br/></Typography>} 
                        secondary={<Typography variant='body1'>
                        {Object.keys(user?.requisites.bankNumber|| {}).length > 0 ? user?.requisites.bankNumber : 'Нет данных'}
                        </Typography>}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText 
                        primary={<Typography variant='caption'>БИК БАНКА<br/></Typography>} 
                        secondary={<Typography variant='body1'>
                        {Object.keys(user?.requisites.bankBik|| {}).length > 0 ? user?.requisites.bankBik : 'Нет данных'}
                        </Typography>}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText 
                        primary={<Typography variant='caption'>КОРР.СЧЁТ БАНКА<br/></Typography>} 
                        secondary={<Typography variant='body1'>
                        {Object.keys(user?.requisites.bankCorNumber|| {}).length > 0 ? user?.requisites.bankCorNumber : 'Нет данных'}
                        </Typography>}
                    />
                </ListItem>
            </List>
            }
            {content === "edit" && 
            <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} sx={{marginTop:'10px'}}>
                <TextField
                label="ФИО ПОЛУЧАТЕЛЯ"
                error={Boolean(errors.userName?.message)}
                helperText={errors.userName?.message}
                {...register('userName', { required: "Напишите имя получателя" })}
                fullWidth />
                <TextField
                label="НОМЕР КАРТЫ"
                error={Boolean(errors.cardNumber?.message)}
                helperText={errors.cardNumber?.cardNumber}
                type='number'
                {...register('cardNumber', { required: "Укажите 16 цифр",
                pattern:{value: /^\d{16}$/,
                message: "Номер карты должен состоять из 16 цифр"} })}
                fullWidth />
                <TextField
                label="ИНН"
                error={Boolean(errors.inn?.message)}
                helperText={errors.inn?.message}
                type='number'
                {...register('inn', { required: "Укажите ИНН из 10 цифр",
                pattern:{value: /^\d{12}$/,
                message: "ИНН должен состоять из 12 цифр"} })}
                fullWidth />
                <TextField
                label="НАИМЕНОВАНИЕ БАНКА"
                error={Boolean(errors.bankName?.message)}
                helperText={errors.bankName?.message}
                {...register('bankName', { required: "Укажите нименование банка" })}
                fullWidth />
                <TextField
                label="НОМЕР СЧЁТА"
                error={Boolean(errors.bankNumber?.message)}
                helperText={errors.bankNumber?.message}
                type='number'
                {...register('bankNumber', { required: "Укажите номер счета 20 цифр",
                pattern:{value: /^\d{20}$/,
                message: "Номер счета должен состоять из 20 цифр"} })}
                fullWidth />
                <TextField
                label="БИК БАНКА"
                error={Boolean(errors.bankBik?.message)}
                helperText={errors.bankBik?.message}
                type='number'
                {...register('bankBik', { required: "Укажите БИК 9 цифр",
                pattern:{value: /^\d{9}$/,
                message: "БИК должен состоять из 9 цифр"} })}
                fullWidth />
                <TextField
                label="КОРР.СЧЁТ БАНКА"
                error={Boolean(errors.bankCorNumber?.message)}
                helperText={errors.bankCorNumber?.message}
                type='number'
                {...register('bankCorNumber', { required: "Укажите к/с 20 цифр",
                pattern:{value: /^\d{20}$/,
                message: "Номер корр.счета должен состоять из 20 цифр"} })}
                fullWidth />
                <Button disabled={!isValid} type='submit' size="large" variant="contained" fullWidth>
                OK
                </Button>
                </Stack>
            </form>
                    
            </DialogContent>}
            <DialogContent>
            <Typography variant='caption'>
            Начисляем вознаграждения только на карты российских банков.
            </Typography>
            </DialogContent>
            <DialogActions>
                {content === "info" &&
                <Button
                    onClick={()=> setContent("edit")}
                >
                    Редактировать
                </Button> }
                <Button
                    onClick={onCloseDialog}
                >
                    Отмена
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditRequisDialog

/*
const onEditable = async (values, nickname, email) => {
        const fields = { nickname, email, values }
        await axios.patch(`/auth`,fields).catch((err)=>{
            console.warn(err)
        });
        dispatch(fetchAuthMe())
        handleClose()

    }

    const onSubmit = async (values) => {
        const {nickname, email, ...valuesData} = values;
        const fields = { nickname, email }
        await axios.post(`/check-user`,fields).then((data) => {
            if(data.data.email){setEmailOk(true)} else setEmailOk(false)
            if(data.data.nickname){setNicknameOk(true)} else setNicknameOk(false)
            if(!data.data.email && !data.data.nickname){
                onEditable(valuesData, nickname, email)
            }
        }).catch((err)=>{
            console.warn(err)
        });
    };
*/