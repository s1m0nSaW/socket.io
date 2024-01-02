import { Card, CardContent, Grid, Stack, Toolbar, Typography, } from "@mui/material";
import React from "react";

const Rsvp = () => {
    return (
        <Grid
            container
            justifyContent="center"
            alignItems="center"
            direction='row'
            spacing={2}
            sx={{ padding:'10px'}}
        >
            <Grid item
            xs={12}
            md={12}
            lg={12}>
                <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={1}
                >
                    <Typography variant="h4" color='dodgerblue' component="div">
                        RSVP
                    </Typography>
                    <Typography variant='body1' align='center'>
                    <b>RSVP</b> - игровая валюта, необходимая для создания игры. Приглашенные в игру пользователи ничего не теряют.<br/><br/> Обычные пользователи получают <b>3 бесплатных RSVP ежедневно</b>, в то время как пользователи со статусом "<b>спонсор</b>" - <b>10 RSVP ежедневно</b>.
                    </Typography>
                    <Toolbar/>
                    <Typography variant="h4" color='dodgerblue' component="div">
                        Как получить RSVP?
                    </Typography>
                </Stack>
            </Grid>
            <Grid item
            xs={12}
            md={3}
            lg={3}>
                <Card 
                sx={{height:'100%'}}>
                    <CardContent>
                        <Typography variant="h6" component="div">
                        <b>Рекомендовать друзьям</b><br/><br/>
                        </Typography>
                        <Typography variant="body1" align="center">
                        Получайте <b>5 RSVP</b> за каждого человека, который укажет ваш никнейм при регистрации. 
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item 
            xs={12}
            md={3}
            lg={3}>
                <Card
                sx={{height:'100%'}}>
                    <CardContent>
                        <Typography variant="h6" component="div">
                        <b>Посмотреть рекламу</b><br/><br/>
                        </Typography>
                        <Typography variant="body1" align="center">
                        Смотрите рекламные ролики и получайте дополнительные <b>RSVP</b>.
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item
            xs={12}
            md={3}
            lg={3}>
                <Card
                sx={{height:'100%'}}>
                    <CardContent>
                        <Typography variant="h6" component="div">
                        <b>Купить. ЦЕНЫ:</b><br/><br/>
                        </Typography>
                        <Typography variant="body1" align="center">
                        10 RSVP - 99 ₽<br/>
                        30 RSVP - 199 ₽<br/>
                        100 RSVP - 499 ₽<br/>
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Toolbar/>
        </Grid>
    );
};

export default Rsvp;
