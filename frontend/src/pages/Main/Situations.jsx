import { Avatar, Card, CardContent, CardHeader, Grid, Typography, } from "@mui/material";
import React from "react";

import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

const Situations = () => {
    return (
        <Grid
            container
            spacing={2}
            sx={{ padding:'10px'}}
        >
            <Grid item 
            sx={{height:'100'}}
            xs={12}
            md={4}
            lg={4}>
                <Card 
            sx={{height:'100%'}}>
                    <CardHeader
                        avatar={
                            <Avatar sx={{ bgcolor: "violet" }}>
                                        <PersonSearchIcon/>
                                    </Avatar>
                        }
                        title={<Typography variant="h6"><b>Знакомство по правилам: когда игра становится первым шагом</b></Typography>}
                    />
                    <CardContent>
                        <Typography variant="body2">
                        По совету друга, <b>Вова</b> зарегистрировался на сайте <b>ochem.ru</b>.<br/><br/> Однажды вечером, перелистывая список друзей своего друга, он обратил внимание на <b>Валю</b> и заинтересовался. <b>Вова</b> добавил ее в друзья и предложил поиграть в игру <b>"Знакомство"</b>.<br/><br/> В процессе игры они общались и обнаружили, что у них много общих интересов.
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item 
            xs={12}
            md={4}
            lg={4}>
                <Card
            sx={{height:'100%'}}>
                    <CardHeader
                        avatar={
                            <Avatar sx={{ bgcolor: "violet" }}>
                                        <RestaurantIcon/>
                                    </Avatar>
                        }
                        title={<Typography variant="h6"><b>Скрывая неловкость: история первого свидания</b></Typography>}
                    />
                    <CardContent>
                        <Typography variant="body2">
                        <b>Вова</b> пригласил <b>Валю</b> на первое свидание. Когда они встретились, <b>Валя</b> оказалась гораздо красивее, чем он ожидал, и <b>Вова</b> немного засмущался и не мог придумать, о чем можно было бы поговорить с ней. <b>Валя</b> заметила его неловкость и предложила им поиграть на сайте <b>ochem.ru</b>.<br/><br/>

                        Они выбрали тему, которая была им обоим интересна, и постепенно <b>Вова</b> расслабился. Они стали обсуждать различные темы и делиться впечатлениями. <br/><br/>
                        Игра помогла им преодолеть первоначальное неловкое молчание, и вскоре разговор между <b>Вовой</b> и <b>Валей</b> стал увлекательным и интересным.
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item 
            xs={12}
            md={4}
            lg={4}>
                <Card
            sx={{height:'100%'}}>
                    <CardHeader
                        avatar={
                            <Avatar sx={{ bgcolor: "violet" }}>
                                        <SupervisorAccountIcon/>
                                    </Avatar>
                        }
                        title={<Typography variant="h6"><b>Игра о будущем: поиски согласия</b></Typography>}
                    />
                    <CardContent>
                        <Typography variant="body2">
                        <b>Вова</b> и <b>Валя</b> обнаружили, что у них совершенно разные планы на жизнь, когда играли на тему <b>"Мечты и желания"</b>.<br/><br/> Один из них был более амбициозным, в то время как другой был склонен к более скромным планам на будущее.<br/><br/> Общение и обсуждение своих взглядов помогли им найти компромисс, который устроил обоих. Теперь у них есть общее видение будущего.
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Situations;
