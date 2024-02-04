import { Button, Card, CardContent, CardHeader, Checkbox, FormControlLabel, Grid, Link, Paper, Stack, TextField, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from "react-router-dom";

import InfoIcon from '@mui/icons-material/Info';

import { fetchRegister } from "../../redux/slices/auth";
import axios from '../../axios.js'

const Registration = ({ handleOpenDialog }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { referal } = useParams();
    const [ nicknameOk, setNicknameOk ] = React.useState(false);
    const [ emailOk, setEmailOk ] = React.useState(false);

    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        defaultValues: {
        nickname: '',
        email: '',
        promoter: referal,
        password: '',
        checkbox: false,
        },
        mode: 'onChange',
    });

    const onConfirmed = async (values, promoter, nickname, email,) => {
        try {
            const fields = {
                ...values,
                promoter,
                nickname,
                email,
            }
            const data = await dispatch(fetchRegister(fields));
    
            if ('token' in data.payload) {
                window.localStorage.setItem('token', data.payload.token)
                navigate(`/prfl/${data.payload._id}`)
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
            if(data.data.email){setEmailOk(true)} else setEmailOk(false)
            if(data.data.nickname){setNicknameOk(true)} else setNicknameOk(false)
            if(!data.data.email && !data.data.nickname) {
                onConfirmed(valuesData, promoter, nickname, email,)
            }
        }).catch((err)=>{
            console.warn(err)
        });
    };

    return (
        <Grid item xs={12} md={8} lg={8} justifyContent="center" alignItems="center">
            <Card sx={{ height: "100%" }} elevation={3}>
                <CardHeader
                    title={<Typography align="center" variant="h4" color='dodgerblue' sx={{ textShadow: "1px 1px 2px #ba68c8" }}>Регистрация</Typography>}
                />
                <CardContent>
                    <Paper sx={{padding:'10px', borderColor:'red'}} variant="outlined">
                        <Typography variant="caption" color="text.secondary">
                            Укажите никнейм друга и получите 5 RSVP за регистрацию.<br/>
                            Рекомендуем добавить сайт на главный экран.<InfoIcon fontSize="small" color="primary" onClick={handleOpenDialog}/>
                        </Typography>
                    </Paper>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={2} sx={{ marginTop: "20px" }}>
                            <TextField
                                label="Кто пригласил? (минимум 5 символов)"
                                fullWidth
                                {...register("promoter")}
                            />
                            <TextField
                                label="Ваш никнейм (минимум 5 символов)"
                                error={Boolean(errors.nickname?.message)}
                                helperText={errors.nickname?.message}
                                {...register("nickname", {
                                    required: "Придумайте уникальный никнейм",
                                })}
                                fullWidth
                            />
                            {nicknameOk && (
                                <Typography variant="caption" color="primary">
                                    Такой никнейм уже сужествует
                                </Typography>
                            )}
                            <TextField
                                label="E-Mail"
                                error={Boolean(errors.email?.message)}
                                helperText={errors.email?.message}
                                type="email"
                                {...register("email", {
                                    required: "Укажите почту",
                                })}
                                fullWidth
                            />
                            {emailOk && (
                                <Typography variant="caption" color="primary">
                                    Такой email уже сужествует
                                </Typography>
                            )}
                            <TextField
                                label="Пароль"
                                error={Boolean(errors.password?.message)}
                                helperText={errors.password?.message}
                                type="password"
                                {...register("password", {
                                    required: "Укажите пароль",
                                })}
                                fullWidth
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        {...register("checkbox", {
                                            required:
                                                "Ознакомьтесь с политикой конфиденциальности",
                                        })}
                                        name="checkbox"
                                    />
                                }
                                label={
                                    <Typography gutterBottom variant="caption">
                                        Принимаю{" "}
                                        <Link variant="caption" href="/info">
                                            политику конфиденциальности
                                        </Link>{" "}и{" "}
                                        <Link variant="caption" href="/info">
                                            договор-оферту
                                        </Link>
                                    </Typography>
                                }
                            />
                            <Button
                                disabled={!isValid}
                                type="submit"
                                size="large"
                                variant="contained"
                                fullWidth
                            >
                                Зарегистрироваться
                            </Button>
                        </Stack>
                    </form>
                    <Toolbar/>
                </CardContent>
            </Card>
        </Grid>
    );
};

export default Registration;
