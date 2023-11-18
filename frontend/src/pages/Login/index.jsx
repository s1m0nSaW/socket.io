import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";

import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";
import { Grid, Stack, Toolbar } from "@mui/material";

export const Login = () => {
    const navigate = useNavigate();
    const isAuth = useSelector(selectIsAuth);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.data);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onChange",
    });

    const onSubmit = async (values) => {
        const data = await dispatch(fetchAuth(values));

        if (!data.payload) {
            return alert("Не удалось авторизоваться");
        }

        if ("token" in data.payload) {
            window.localStorage.setItem("token", data.payload.token);
        }
    };

    if (isAuth) {
        return <Navigate to={`/prfl/${user.nickname}`} />;
    }

    return (
        <Grid container justifyContent="center" alignItems="center">
            <Toolbar />
            <Grid item xs={12} md={12} justifyContent="center">
                <Paper
                    elevation={3}
                    sx={{ padding: "10px", maxWidth: "500px" }}
                >
                    <Typography variant="h5">Вход в аккаунт</Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack sx={{ marginTop: "15px" }} spacing={2}>
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
                            <Button
                                disabled={!isValid}
                                type="submit"
                                size="large"
                                variant="contained"
                            >
                                Войти
                            </Button>
                            <Button
                                onClick={() => navigate(`/register`)}
                                size="small"
                                variant="text"
                                color="error"
                            >
                                <u>Регистрация</u>
                            </Button>
                        </Stack>
                    </form>
                </Paper>
            </Grid>
        </Grid>
    );
};
