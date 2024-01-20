import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, Grid, List, ListItem, ListItemAvatar, ListItemText, Rating, Slide, Stack, Step, StepLabel, Stepper, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import GroupsIcon from '@mui/icons-material/Groups';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

import axios from '../../axios.js'
import { authStatus, fetchAuthMe } from "../../redux/slices/auth.js";
import FriendFromDialog from "../Game/FriendFromDialog.jsx";
import UserAvatar from "../../components/UserAvatar.jsx";

const steps = [
    'Выберите друга',
    'Выберите игру',
    'Создать новую игру',
  ];

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const NewGameDialog = ({ open, handleClose, onSuccess, user, socket, inGams, mate }) => {
    const [themes, setThemes] = React.useState();
    const [rates, setRates] = React.useState();
    const [friends, setFriends] = React.useState();
    const [theme, setTheme] = React.useState('');
    const [friend, setFriend] = React.useState('');
    const [activeStep, setActiveStep] = React.useState(0);
    const status = useSelector(authStatus);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onExit = () => {
        setTheme('')
        setFriend('')
        setActiveStep(0)
        handleClose()
    }

    const questionsCount = (t) => {
        const themeObj = themes.find((obj) => obj.theme === t);

        // Если объект найден, возвращаем значение count, иначе возвращаем null или другое значение по умолчанию
        return themeObj ? themeObj.count : null;
    }

    const handleChangeTheme = (theme) => {
        if(theme.forSponsor){
            if(user.status === 'sponsor'){
                setTheme(theme);
                setActiveStep(2)
            } else {
                onSuccess('Игра только для спонсоров', 'error')
            }
        } else {
            setTheme(theme);
            setActiveStep(2)
        }
    };

    const handleChangeFriend = (friend) => {
        setFriend(friend);
        setActiveStep(1)
    };

    const createNewGame = async () => {
        const fields = {
            gameName: `Игра ${user.nickname} & ${friend.nickname}`,
            theme: theme.theme,
            user2: friend._id,
        }
        await axios.post('/new-game', fields).then((data)=>{
            dispatch(fetchAuthMe());
            socket.emit("upGames", { userId: friend._id });
            const fields = {
                userId: friend._id,
                message:`${user.nickname} пригласил поиграть`, 
                severity: 'info',
            }
            socket.emit("socketNotification", fields);
            if(inGams === false) {navigate(`/gams`)} else { onExit() }
            onSuccess('Игра создана', 'success')
        }).catch((err)=>{
            console.warn(err); 
            onSuccess('Не удалось создать игру', 'error')
            onExit()
        });
    }

    React.useEffect(()=>{
        const getRates = async () => {
            try {
                const _rates = await axios.get('/all-rates')
                if(_rates) {
                    setRates(_rates.data)
                }
            } catch (err) {
                console.warn(err)
            }
        }
        const getThemes = async () => {
            await axios.get('/all-quest')
            .then((data) => {
                let quests = data.data;
                const groupedThemes = quests.reduce((acc, question) => {
                    if (!acc[question.theme]) {
                      acc[question.theme] = {
                        theme: question.theme,
                        count: 0
                      };
                    }
                    acc[question.theme].count++;
                    return acc;
                  }, {});
                  
                  const uniqueThemesArray = Object.values(groupedThemes);
                setThemes(uniqueThemesArray)
            })
            .catch(err => console.warn(err));
        };
        getThemes();
        getRates();

        const getFriends = async () => {
            const fields = {
                friends: user?.friends
            }
            await axios.post('/friends', fields).then((data)=>{
                setFriends(data.data)
            }).catch((err)=>{
                console.warn(err); 
            });
        };

        if(status !== 'loading'){
            if(user?.friends.length !== 0){
                getFriends()
            }
        }

    },[ user, status ])

    React.useEffect(()=>{
        if(mate !== false){
            handleChangeFriend(mate)
        }
    },[mate])

    return (
        <Dialog
            fullWidth
            maxWidth={'xs'}
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={onExit}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle sx={{ paddingBottom:'10px'}}>
                Новая игра за 1 RSVP
            </DialogTitle>
            <Box sx={{ width: '100%' }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                    ))}
                </Stepper>
            </Box>
            {activeStep === 0 && <DialogContent sx={{width:'100%'}}>
                {friends && <>
                    {friends.length !== 0 ? (
                        <Grid container>
                            <List sx={{ width: "100%", maxHeight: 300, }}>
                                {friends.map((friend) => (<FriendFromDialog key={friend._id} friend={friend} setFriend={handleChangeFriend}/>))}
                            </List>
                        </Grid>
                    ):
                    <Stack
                        direction="column"
                        justifyContent="space-evenly"
                        alignItems="center">
                        <Toolbar/>
                        <GroupsIcon color="disabled" sx={{ fontSize: 40 }} />
                        <Typography variant="subtitle1">У Вас ещё нет друзей</Typography>
                        <Typography variant="caption">Вы можете найти друзей во вкладке поиск</Typography>
                    </Stack>
                    }
                </>}
            </DialogContent>}
            {activeStep === 1 && <DialogContent sx={{width:'100%'}}>
                {rates && <>
                    {rates.length !== 0 ? (
                        <Grid container>
                            <List sx={{ width: "100%", maxHeight: 300 }}>
                                {rates?.map((rate) => (
                                    <div key={rate._id}>
                                        <ListItem alignItems="flex-start" onClick={()=>handleChangeTheme(rate)} >
                                            <ListItemText
                                                primary={<Typography>
                                                    {rate.theme}&nbsp; 
                                                    {rate.forSponsor && <MonetizationOnIcon fontSize="small" color="primary"/>}
                                                </Typography>}
                                                secondary={<Typography>Количество вопросов: {questionsCount(rate.theme)}</Typography>}
                                            />
                                        </ListItem>
                                        <Stack direction='row' justifyContent='center' alignItems='flex-start' sx={{ marginBottom:'10px'}}>
                                            <Rating name="read-only" value={rate.rating} readOnly size="small"/>
                                        </Stack>
                                        <Divider />
                                    </div>
                                ))}
                            </List>
                        </Grid>
                    ):
                    <Stack
                        direction="column"
                        justifyContent="space-evenly"
                        alignItems="center">
                        <Toolbar/>
                        <GroupsIcon color="disabled" sx={{ fontSize: 40 }} />
                        <Typography variant="subtitle1">Нет ещё игр</Typography>
                    </Stack>
                    }
                </>}
            </DialogContent>}
            {activeStep === 2 && <DialogContent sx={{width:'100%'}}>
                {theme && <>
                    <Typography variant='caption'>Вы будете играть в игру:</Typography>
                    <ListItem alignItems="flex-start">
                        <ListItemText
                            primary={theme?.theme}
                            secondary={`Количество вопросов: ${theme?.count}`}
                        />
                    </ListItem>
                </>}
                {friend && <>
                    <Typography variant='caption'>Вы будете играть с</Typography>
                    <ListItem alignItems="flex-start" disableGutters>
                        <ListItemAvatar>
                            <UserAvatar user={friend}/>
                        </ListItemAvatar>
                        <ListItemText
                            primary={friend.fullname !== 'none' ? friend.fullname : 'Имя не указано'}
                            secondary={friend.nickname}
                        />
                    </ListItem>
                </>}
            </DialogContent>}
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, margin:'15px' }}>
                <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={()=> setActiveStep(activeStep - 1)}
                sx={{ mr: 1 }}
                >
                Назад
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                {activeStep === 2 &&
                    <Button
                    size="small"
                    disabled={friend === '' || theme === ''}
                    variant="contained"
                    onClick={()=>createNewGame()}
                >
                    Создать игру
                </Button>}
                <Button
                    onClick={onExit}
                >
                    Отмена
                </Button>
            </Box>
        </Dialog>
    );
};

export default NewGameDialog;