import React from 'react';
import { Grid, Stack, Typography, Toolbar, } from '@mui/material';
import { useSelector } from 'react-redux';

import { selectIsAuth } from '../redux/slices/auth.js';
import Onboarding from './Main/Onboarding.jsx';
import Situations from './Main/Situations.jsx';
import Questions from './Main/Questions.jsx';
import Registration from './Main/Registration.jsx';
import Header from '../components/Header.jsx';

export const Main = () => {
    const isAuth = useSelector(selectIsAuth)
    return (
        <React.Fragment>
        <Header profile={true}/>
            <Grid
                container
                justifyContent='center' 
                alignItems="center"
                spacing={2}
            >  
                <Grid item xs={12} md={12} justifyContent='center'>
                <Stack
                sx={{ width: '100%', padding: '20px' }}
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={1}
                >
                    <Toolbar/>
                    <Typography align='center' variant='h6'>
                    Если не о чем поговорить, заходи в Ochem.ru
                    </Typography>
                   
                    <Toolbar/>
                </Stack>
                <Stack
                sx={{ width: '100%', padding: '20px' }}
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={1}
                >
                    <Typography variant='body1' align='center'>
                    Описание игры
                    </Typography>
                </Stack>
                </Grid>
                <Situations/>
                <Questions/>
                {!isAuth && <Registration/>}
                <Grid item xs={12} md={8} lg={8} justifyContent='center' sx={{ width:'100%'}}>
                    <Onboarding/>
                </Grid>
                </Grid>
        </React.Fragment>
    );
};