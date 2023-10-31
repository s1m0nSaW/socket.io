import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, InputLabel, Link, MenuItem, Select, Slide, Stack, TextField, Typography } from '@mui/material';
import React from 'react'
import { useDispatch } from 'react-redux';
import { fetchRegister } from '../redux/slices/auth';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import axios from '../axios.js';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const RegDialog = ({ open, handleClose }) => {
    const dispatch = useDispatch();
    const [ promoterOk, setPromoterOk ] = React.useState(false);
    const [ nicknameOk, setNicknameOk ] = React.useState(false);
    const [ age, setAge ] = React.useState('');
    const [ gender, setGender ] = React.useState('');
    const [ emailOk, setEmailOk ] = React.useState(false);
    const { referal } = useParams()

    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        defaultValues: {
        nickname: '',
        fullname: '',
        age: '',
        email: '',
        promoter: referal,
        password: '',
        checkbox: false,
        },
        mode: 'onChange',
    });

    const handleChangeAge = (event) => {
        setAge(event.target.value);
    };

    const handleChangeGender = (event) => {
        setGender(event.target.value);
    };

    const onConfirmed = async (values, promoter, nickname, email,) => {
        try {
            const fields = {
                ...values,
                promoter,
                nickname,
                email,
                age,
                gender,
                date: +new Date()
            }
            const data = await dispatch(fetchRegister(fields));
    
            if ('token' in data.payload) {
                window.localStorage.setItem('token', data.payload.token)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const onSubmit = async (values) => {
        const {promoter, nickname, email, ...valuesData} = values;
        const fields = { promoter, nickname, email }
        //onConfirmed(valuesData, promoter, nickname, email,)
        await axios.post(`/check-user`,fields).then((data) => {
            if(!data.data.promoter){setPromoterOk(true)} else setPromoterOk(false)
            if(data.data.email){setEmailOk(true)} else setEmailOk(false)
            if(data.data.nickname){setNicknameOk(true)} else setNicknameOk(false)
            if(data.data.promoter && !data.data.email && !data.data.nickname) {
                onConfirmed(valuesData, promoter, nickname, email,)
            }
        }).catch((err)=>{
            console.warn(err)
        });
    };

    return (
        <Dialog
            PaperProps={{ style: { backgroundColor: "#141414", width:'100%' } }}
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>Регистрация</DialogTitle>
            <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} sx={{marginTop:'10px'}}>
                <TextField
                label="Кто пригласил?"
                error={Boolean(errors.promoter?.message)}
                helperText={errors.promoter?.message}
                {...register('promoter', { required: "Укажите никнейм пригласившего" })}
                fullWidth />
                {promoterOk && <Typography variant='caption' color='primary'>Не удалось найти пригласившего</Typography>}
                <TextField
                label="ФИО полностью"
                error={Boolean(errors.fullname?.message)}
                helperText={errors.fullname?.message}
                {...register('fullname', { required: "Укажите ваши ФИО" })}
                fullWidth />
                <FormControl fullWidth>
                    <InputLabel id="select-label">Возраст</InputLabel>
                    <Select
                    labelId="select-label"
                    label="Возраст"
                    value={age}
                    onChange={handleChangeAge}
                    >
                        <MenuItem sx={{backgroundColor:'gray'}} value={'18‑24 года'}>18‑24 года</MenuItem>
                        <MenuItem sx={{backgroundColor:'gray'}} value={'25‑34 года'}>25‑34 года</MenuItem>
                        <MenuItem sx={{backgroundColor:'gray'}} value={'35‑44 года'}>35‑44 года</MenuItem>
                        <MenuItem sx={{backgroundColor:'gray'}} value={'45-54 года'}>45-54 года</MenuItem>
                        <MenuItem sx={{backgroundColor:'gray'}} value={'старше 55 лет'}>старше 55 лет</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id="select">Пол</InputLabel>
                    <Select
                    labelId="select"
                    label="Пол"
                    value={gender}
                    onChange={handleChangeGender}
                    >
                        <MenuItem sx={{backgroundColor:'gray'}} value={'Мужской'}>Мужской</MenuItem>
                        <MenuItem sx={{backgroundColor:'gray'}} value={'Женский'}>Женский</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                label="Ваш никнейм"
                error={Boolean(errors.nickname?.message)}
                helperText={errors.nickname?.message}
                {...register('nickname', { required: "Придумайте уникальный никнейм" })}
                fullWidth />
                {nicknameOk && <Typography variant='caption' color='primary'>Такой никнейм уже сужествует</Typography>}
                <TextField
                label="E-Mail"
                error={Boolean(errors.email?.message)}
                helperText={errors.email?.message}
                type='email'
                {...register('email', { required: "Укажите почту" })}
                fullWidth />
                {emailOk && <Typography variant='caption' color='primary'>Такой email уже сужествует</Typography>}
                <TextField
                label="Пароль"
                error={Boolean(errors.password?.message)}
                helperText={errors.password?.message}
                type='password'
                {...register('password', { required: "Укажите пароль" })}
                fullWidth />
                <FormControlLabel
                control={
                    <Checkbox {...register('checkbox', { required: "Ознакомьтесь с политикой конфиденциальности" })} name="checkbox" />
                }
                label={<Typography gutterBottom variant='caption'>Принимаю <Link variant="caption" href="/info">политику конфиденциальности</Link></Typography>}
                />
                <Button disabled={!isValid || age === '' || gender === ''} type='submit' size="large" variant="contained" fullWidth>
                Зарегистрироваться
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

export default RegDialog