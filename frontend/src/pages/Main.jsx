import React from 'react';
import { Grid, Stack, Typography, Toolbar, } from '@mui/material';
//import { useSelector } from 'react-redux';

//import { selectIsAuth } from '../redux/slices/auth.js';
import Situations from './Main/Situations.jsx';
//import Registration from './Main/Registration.jsx';
import Header from '../components/Header.jsx';
import Rsvp from './Main/Rsvp.jsx';
import AddApp from './Main/AddApp.jsx';

export const Main = () => {
    //const isAuth = useSelector(selectIsAuth)
    const [ openAdd, setOpenAdd ] = React.useState(false);

    const handleCloseAdd = () => {
        setOpenAdd(false)
    };

    /*const handleOpenAdd = () => {
        setOpenAdd(true)
    }*/

    return (
        <React.Fragment>
        <Header profile={true} back={false}/>
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
                        <Typography align='center' variant='h4'  color='dodgerblue' sx={{ textShadow: "1px 1px 2px #ba68c8" }}>
                        Когда не о чем поговорить, заходите в ochem.ru
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
                        Игры для двоих, где один выбирает ответ на вопрос, второй должен угадать этот выбор.<br/>
                         После этого роли меняются.<br/><br/> Во время игры доступен чат для общения.
                        </Typography>
                    </Stack>
                    </Grid>
                    <Grid item xs={12} md={12} justifyContent='center'>
                        <Situations/>
                    </Grid>
                    <Grid item xs={12} md={12} justifyContent='center'>
                        <Rsvp/>
                    </Grid> 
                    
                </Grid>
                <Toolbar/>
                <AddApp open={openAdd} handleClose={handleCloseAdd}/>
        </React.Fragment>
    );
};