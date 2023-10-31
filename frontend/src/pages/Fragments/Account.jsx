import { Grid, Paper, Stack, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useSelector } from 'react-redux';

import NewReleasesIcon from '@mui/icons-material/NewReleases';

const Account = () => {
    const user = useSelector((state) => state.auth.data)

    return (
        <Grid container>
            <Stack
                direction="row"
                justifyContent="space-around"
                alignItems="flex-start"
                spacing={1}
                sx={{ padding: "10px", width: "100vw" }}
            >
                <Paper sx={{ padding: "10px", borderRadius: "5px" }}>
                    <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        spacing={1}
                    >
                        <Typography variant="h5" sx={{ color: "white" }}>
                            {user?.friends.length}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "white" }}>
                            Подписчики
                        </Typography>
                    </Stack>
                </Paper>
                <Paper sx={{ padding: "10px", borderRadius: "5px" }}>
                    <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        spacing={1}
                    >
                        <Typography variant="h5" sx={{ color: "white" }}>
                            {user?.inviteds.length}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "white" }}>
                            Рефералы
                        </Typography>
                    </Stack>
                </Paper>
                <Paper sx={{ padding: "10px", borderRadius: "5px" }}>
                    <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        spacing={1}
                    >
                        <Typography variant="h5" sx={{ color: "white" }}>
                            {user?.purchases.length}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "white" }}>
                            Сделки
                        </Typography>
                    </Stack>
                </Paper>
            </Stack>
            {user?.purchases.length === 0 && (
                <Stack
                    direction="column"
                    justifyContent="space-evenly"
                    alignItems="center"
                    spacing={1}
                    sx={{ width: '100vw'}}
                >
                    <Toolbar />
                    <Toolbar />
                    <NewReleasesIcon
                        color="disabled"
                        sx={{ fontSize: 40 }}
                    />
                    <Typography variant="subtitle1" color='dimgray'>
                        У вас ещё нет сделок
                    </Typography>
                    <Typography variant="caption" color='dimgray'>
                        Здесь будут отображаться завершенные сделки
                    </Typography>
                </Stack>
            )}
        </Grid>
    );
}

export default Account;