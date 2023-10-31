import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuth } from '../redux/slices/auth';
import { Grid, Paper, Stack, Typography, Toolbar, Fab, Backdrop, CircularProgress, Card, CardHeader, CardMedia, CardContent, Link, List, ListItem, ListItemAvatar, ListItemText, Divider, Avatar, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';

import RegDialog from '../components/RegDialog.jsx';
import styles from '../index.scss';
import {Header} from '../components/Header/index.jsx'
import Onboarding from '../components/Onboarding.jsx';

import simple from '../img/simple.png'

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';

export const Main = () => {
    const isAuth = useSelector(selectIsAuth)
    const navigate = useNavigate();
    const [backdrop, setBackdrop] = React.useState(true);
    const user = useSelector((state) => state.auth.data);
    const [openRegDialog, setOpenRegDialog] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);

    const handleChangePanel = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleOpenRegDialog = () => {
        setOpenRegDialog(true)
    }

    const handleCloseRegDialog = () => {
        setOpenRegDialog(false)
    }

    React.useEffect(()=>{
        if (isAuth) {
            navigate(`/lk/${user.nickname}`);
        } else setBackdrop(false)
    },[isAuth,user,navigate])

    return (
        <React.Fragment>
        <Header/>
            <Grid
                container
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
                    <Typography align='center' variant='h6' color='white' sx={{ textShadow: "0px 0px 30px #FF30AB" }}>
                    Умный кэшбэк
                    </Typography>
                    <Typography align='center' variant='body2' sx={{ color: "#FF30AB" }}>
                        Вместо того чтобы тратить миллионы на рекламу и блогеров, продавцы товаров платят участникам нашей партнерской сети.
                    </Typography>
                    <Toolbar/>
                </Stack>
                <Stack
                sx={{ width: '100%', padding: '20px' }}
                direction="column"
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={1}
                >
                    <Typography variant='body1' sx={{ color: "white" }}>
                    Партнерская сеть, где можно покупать товары и зарабатывать на этом. Как обычный кэшбэк, только он начисляется не самому покупателю, а тем, благодаря кому покупатель узнал о товаре.
                    </Typography>
                </Stack>
                </Grid>
                <Grid item xs={12} md={6} lg={6} justifyContent='center'>
                    <Card sx={{ height:'100%' }}>
                        <CardHeader 
                            title="Как это устроено?" 
                            subheader="Сервис основан на концепции многоуровневого маркетинга (Всего 5 уровней)"
                        />
                        <CardContent>
                            <List>
                                <Divider variant="inset" component="li" />
                                <ListItem disableGutters>
                                    <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'violet' }}>1</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary={<Typography variant='body1'><b>Вы покупаете товар</b><br/></Typography>}
                                        secondary={<Typography variant='body2'>- Ваши подписчики (<b>1 уровень</b>) видят это в своей ленте</Typography>}
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                                <ListItem disableGutters>
                                    <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'violet' }}>2</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary={<Typography variant='body1'><b>1 уровень покупает этот же товар</b><br/></Typography>} 
                                        secondary={<Typography variant='body2'>
                                            - Их подписчики (<b>2 уровень</b>) видят это в своей ленте<br/>
                                            - Вам начисляется <b>вознаграждение</b>
                                        </Typography>}
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                                <ListItem disableGutters>
                                    <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'violet' }}>3</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary={<Typography variant='body1'><b>2 уровень покупает этот же товар</b><br/></Typography>}  
                                        secondary={<Typography variant='body2'>
                                            - Их подписчики (<b>3 уровень</b>) видят это в своей ленте<br/>
                                            - Вам и 1 уровню начисляется <b></b>вознаграждение<br/>
                                            - 2 уровень становятся вашими подписчиками
                                        </Typography>}
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                                <ListItem disableGutters>
                                    <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'violet' }}>4</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary={<Typography variant='body1'><b>3 уровень покупает этот же товар</b><br/></Typography>}  
                                        secondary={<Typography variant='body2'>
                                            - Их подписчики (<b>4 уровень</b>) видят это в своей ленте<br/>
                                            - Вам, 1 уровню и 2 уровню начисляется <b>вознаграждение</b><br/>
                                            - 3 уровень становятся вашими подписчиками и подписчиками 1 уровня<br/>
                                        </Typography>}
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                                <ListItem disableGutters>
                                    <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'violet' }}>5</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary={<Typography variant='body1'><b>4 уровень покупает этот же товар</b><br/></Typography>}
                                        secondary={<Typography variant='body2'>
                                            - Их подписчики (<b>5 уровень</b>) видят это в своей ленте<br/>
                                            - Вам, 1 уровню, 2 уровню и 3 уровню начисляется <b>вознаграждение</b><br/>
                                            - 4 уровень становятся вашими подписчиками, подписчиками 1 уровня и 2 уровня
                                        </Typography>}
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                                <ListItem disableGutters>
                                    <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'violet' }}>6</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary={<Typography variant='body1'><b>5 уровень покупает этот же товар</b><br/></Typography>}
                                        secondary={<Typography variant='body2'>
                                            - Вам, 1 уровню, 2 уровню, 3 уровню и 4 уровню начисляется <b>вознаграждение</b><br/>
                                            - 5 уровень становятся вашими подписчиками, подписчиками 1 уровня, 2 уровня и 3 уровня<br/>
                                        </Typography>}
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                        <CardContent>
                            <Typography>Размер вознаграждения устанавливает продавец товара</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6} lg={6} justifyContent='center'>
                    <Card sx={{ height:'100%' }}>
                        <CardHeader 
                            title="Зарабатывай прямо сейчас" 
                            subheader="Приглашайте друзей по реферальной программе, основанной на той же концепции."
                        />
                        <CardMedia
                            component="img"
                            image={simple}
                            style={{backgroundColor:'transparent'}}
                        />
                        <CardContent>
                            <Typography>Можно пригласить неограниченное количество участников</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={12} lg={12} justifyContent='center' sx={{ width:'100%'}}>
                    <Accordion expanded={expanded === 'panel1'} onChange={handleChangePanel('panel1')}>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                        >
                        <Typography>
                        <b>Это финансовая пирамида?</b>
                        </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        <Typography>
                        Финансовая пирамида — это мошеннический проект, который имитирует выгодные инвестиции. Часто используют систему многоуровневого маркетинга.<br/><br/>
                        В России деятельность "Финансовых пирамид" запрещена статьёй 172.2 УК РФ. Организация деятельности по привлечению денежных средств и (или) иного имущества.<br/><br/> В нашей партнерской сети пользователь платит за право на использование программного обеспечения (сайта) для покупки необходимых товаров и получения дополнительного дохода. 
                        </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={expanded === 'panel2'} onChange={handleChangePanel('panel2')}>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2bh-content"
                        id="panel2bh-header"
                        >
                        <Typography><b>Что такое многоуровневый маркетинг?</b></Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        <Typography>
                        Многоуровневый маркетинг (англ. multilevel marketing, MLM) —  это модель продвижения товаров от производителя к потребителю без привычных посредников в виде розничных магазинов, не использует рекламу, пиар-кампании и другие инструменты продвижения.<br/><br/> Многоуровневый сетевой маркетинг используется такими фирмами, как Amway, Oriflame, Zepter International, Vitamax, Avon Products, Faberlic, Mary Kay и т.д.<br/><br/>
                        В нашей партнерской сети нет необходимости продавать товар самостоятельно.
                        </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={expanded === 'panel3'} onChange={handleChangePanel('panel3')}>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3bh-content"
                        id="panel3bh-header"
                        >
                        <Typography>
                        <b>Что будет если никого не пригласить?</b>
                        </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        <Typography>
                        При регистрации нужно указать никнейм пригласившего. Затем вы станете подписчиком этого человека, а также всех, кто пригласил его на сайт до 5-го уровня, а они вашими.<br/><br/> Количество ваших подписчиков будет увеличиваться по мере увеличения количества покупок, совершенных вами и вашими подписчиками.
                        </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={expanded === 'panel4'} onChange={handleChangePanel('panel4')}>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel4bh-content"
                        id="panel4bh-header"
                        >
                        <Typography><b>Про промокод</b></Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        <Typography>
                            Промокод это ваш никнейм, который необходимо придумать при регистрации.
                        </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={expanded === 'panel5'} onChange={handleChangePanel('panel5')}>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel5bh-content"
                        id="panel5bh-header"
                        >
                        <Typography><b>Как добавить сайт на главный экран?</b></Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        <Typography>
                        Как создать ярлык сайта на домашнем экране iPhone или iPad:<br/><br/>
                        1. Откройте на своем iOS-устройстве браузер Safari.<br/>
                        2. Зайдите на интересный для вас сайт.<br/>
                        3. Нажмите на кнопку Поделиться (если вы не видите нижнего меню, нажмите внизу экрана).<br/>
                        4. В появившемся меню выберите На экран «Домой».<br/>
                        5. На следующем экране вы сможете дать своему шорткату подходящее название и проверить веб-адрес.<br/>
                        6. Нажмите кнопку Добавить. На экране вашего iPhone или iPad появится ярлык добавленного веб-ресурса.<br/><br/>

                        Шаги для добавления сайта на рабочий стол Android в Google Chrome будут следующими:<br/><br/>
                        1. Откройте нужный сайт в Google Chrome и нажмите по кнопке меню — три точки в правом верхнем углу.<br/>
                        2. Нажмите по пункту «Добавить на главный экран».<br/>
                        3. Нажмите «Установить», процесс может занять некоторое время.
                        </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                
                <Grid item xs={12} md={12} justifyContent='center'>
                <Paper sx={{ width: '100%', padding: '20px' }}>
                    <InfoIcon/>
                    <Typography align='center' variant='body2' sx={{ color: "white" }}>
                    <br/><br/>На данный момент возможность покупки товаров находится в разработке.<br/><br/>
                        Реферальная программа работает. Выплаты вознаграждений производятся в максимально короткий срок, зависит от загруженности.
                    </Typography>
                </Paper>
                </Grid>
                <Grid item xs={12} md={12} lg={12} justifyContent='center' sx={{ width:'100%'}}>
                    <Paper sx={{ padding: '20px'}} elevation={3}>
                        <Stack
                            sx={{ height: '100%', minHeight: '50vh', width:'100%', marginBottom: '20px' }}
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            spacing={2}
                        >
                            <Typography align='center' variant="h6">Будь в числе первых за 1990 рублей</Typography>
                            <Typography align='center' variant='body1'>Три подписчика и ты в плюсе</Typography>
                            <Stack direction="column" justifyContent="center" alignItems="center" sx={{ height: '100%'}}>
                                <Fab sx={{ marginTop:'50px', background: 'radial-gradient(circle at top left, #FF30AB, #792C5A)'}} onClick={() => handleOpenRegDialog()}>
                                    <PlayArrowIcon sx={{color:'#fff'}}/>
                                </Fab>
                                <Toolbar/>
                                <Typography align='center' variant="h4" sx={{ color: "#FF30AB", textShadow: "0px 0px 30px #FF30AB" }}>ДЕЙСТВУЙ</Typography>
                            </Stack>
                        </Stack>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={12} lg={12} justifyContent='center' sx={{ width:'100%'}}>
                    <Onboarding/>
                </Grid>
                    <RegDialog open={openRegDialog} handleClose={handleCloseRegDialog}/>
                </Grid>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={backdrop}
                >
                    <CircularProgress color="primary" />
                </Backdrop>
                
            <footer className={styles.footer}>
                <Stack sx={{ backgroundColor: '#141414', marginTop: '30px', paddingTop: '10px'}}>
                <Stack sx={{ width: '100%' }} direction={{ xs: 'column', sm: 'row' }} alignItems={'center'} justifyContent={'center'} spacing={0}>
                <Link variant="caption" href="/info">База знаний</Link>
                </Stack>
                <Typography sx={{marginTop: '10px'}} variant='caption' color='white' align='center' gutterBottom>© 2023 CommunicationCompass.ru - все права защищены.</Typography>
                </Stack>
            </footer>
        </React.Fragment>
    );
};