import React from "react";
import { Avatar, Badge, Button, Chip, Grid, Stack, Toolbar, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import GroupsIcon from '@mui/icons-material/Groups';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SettingsIcon from '@mui/icons-material/Settings';
import RsvpIcon from '@mui/icons-material/Rsvp';
import UpdateIcon from '@mui/icons-material/Update';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MonetizationOnSharpIcon from '@mui/icons-material/MonetizationOnSharp';
import PersonIcon from '@mui/icons-material/Person';

import Header from "../components/Header";
import EditInfoDialog from './Profile/EditInfoDialog';
import SuccessSnack from "../components/SuccessSnack";
import { fetchAuthMe, setData, selectIsAuth, authStatus } from "../redux/slices/auth";
import axios from '../axios.js';
import BuyRsvpDialog from "./Profile/BuyRsvpDialog";
import SettingsDialog from "./Profile/SettingsDialog";
import NewGameDialog from "./Profile/NewGameDialog";
import SponsorDialog from "./Profile/SponsorDialog.jsx";

export const Profile = ({ socket }) => {
    const user = useSelector((state) => state.auth.data);
    const isAuth = useSelector(selectIsAuth);
    const status = useSelector(authStatus);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [editInfo, setEditInfo] = React.useState(false);
    const [successSnack, setSuccessSnack] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');
    const [severity, setSeverity] = React.useState('info');
    const [openBuyDialog, setOpenBuyDialog] = React.useState(false);
    const [openSponsorDialog, setOpenSponsorDialog] = React.useState(false);
    const [openSettingsDialog, setOpenSettingsDialog] = React.useState(false);
    const [openNewGameDialog, setOpenNewGameDialog] = React.useState(false);

    const handleCloseEditInfo = () => {
        setEditInfo(false)
    }

    const handleCloseBuyDialog = () => {
        setOpenBuyDialog(false)
    }

    const handleCloseSponsorDialog = () => {
        setOpenSponsorDialog(false)
    }

    const handleCloseSettingsDialog = () => {
        setOpenSettingsDialog(false)
    }

    const handleCloseNewGameDialog = () => {
        setOpenNewGameDialog(false)
    }

    const onOpenGamesPage = () => {
        dispatch(fetchAuthMe())
        navigate(`/gams`)
    }

    const handleSuccessOpen = (message, severity) => {
        setSuccessMessage(message)
        setSeverity(severity)
        setSuccessSnack(true)
    }

    const handleSuccessClose = () => {
        setSuccessSnack(false)
    }

    function parseMillisecondsIntoReadableTime(milliseconds){
        //Get hours from milliseconds
        var hours = milliseconds / (1000*60*60);
        var absoluteHours = Math.floor(hours);
        var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;
      
        //Get remainder from hours and convert to minutes
        var minutes = (hours - absoluteHours) * 60;
        var absoluteMinutes = Math.floor(minutes);
        var m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;
      
        return h + ' часов ' + m + ' минут';
      }

    const handleFreeRsvp = async () => {
        if(user.rsvpStatus){
            const date = +new Date()
            const data = { rsvpDate: date + 86400000 }
            await axios.patch('/rsvp-date', data).catch((err)=>{
                console.warn(err); 
            });
            dispatch(fetchAuthMe())
        } else {
            const date = +new Date()
            const timeToTrue = parseMillisecondsIntoReadableTime(user.rsvpDate - date)
            handleSuccessOpen(`Ежедневные бесплатные rsvp через ${timeToTrue}`, 'info')
        }
        
    } 

    const updateRsvpStatus = async () => {
        await axios.patch('/rsvp-status').catch((err)=>{
            console.warn(err); 
        });
    }

    React.useEffect(() => {
        if(status !== 'loading'){
            const interval = setInterval(() => {
                const date = +new Date()
                if(date > user.rsvpDate) {
                    const fields = {
                        ...user,
                        rsvpStatus: true,
                    }
                    dispatch(setData(fields));
                    updateRsvpStatus();
                }
            },100)
            return () => {
                clearInterval(interval)
            }
        }
    }, [ dispatch, user, status ])

    React.useEffect(()=>{
        if(status !== 'loading'){
            if (!isAuth) {
                navigate(`/main`);
            } else {
                const searchParams = { userId: user._id };
                socket.emit('joinUser', searchParams);
            }
        }
    },[ isAuth, user, navigate, status, socket ])

    // const src = `http://localhost:5000${user.pic}`
    // const src=`https://ochem.ru/api${user.pic}` 

    return (
        <React.Fragment>
            <Header profile={false} onSuccess={handleSuccessOpen} back={false}/>
            <Toolbar />
            <Toolbar />
            {user && (
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    spacing={1}
                >
                    <Grid item>
                        {user.status === 'sponsor' ? 
                            <Badge
                                sx={{margin:'10px'}}
                                overlap='circular'
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                badgeContent={<MonetizationOnSharpIcon fontSize='small' color="primary" sx={{ backgroundColor:'white', borderRadius:'50%'}}/>}
                            >
                                {user.pic === "none" ? (
                                    <Avatar onClick={() => setEditInfo(true)}>
                                        <PersonIcon />
                                    </Avatar>
                                ) : (
                                    <Avatar
                                        alt={user.nickname}
                                        src={`https://ochem.ru${user.pic}`}
                                        onClick={() => setEditInfo(true)}
                                        sx={{ width: 56, height: 56 }}
                                    />
                                )}
                            </Badge>:
                            <>
                                {user.pic === "none" ? (
                                    <Avatar onClick={() => setEditInfo(true)} sx={{margin:'10px'}}>
                                        <PersonIcon />
                                    </Avatar>
                                ) : (
                                    <Avatar
                                        alt={user.nickname}
                                        src={`https://ochem.ru${user.pic}`}
                                        sx={{ margin:'10px', width: 56, height: 56 }}
                                        onClick={() => setEditInfo(true)}
                                    />
                                )}
                            </>
                            }
                    </Grid>
                    <Grid item>
                        <Stack
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            sx={{ padding: '15px'}}
                        >
                            <Typography variant="caption">{user.nickname}</Typography>
                            {user.fullname === "none" ? (
                                <Typography onClick={() => setEditInfo(true)}>Укажите данные</Typography>
                            ) : (
                                <Typography onClick={() => setEditInfo(true)}>{user.fullname}</Typography>
                            )}
                            {user.profileStatus !== "none" && (
                                <Typography align="center" variant="caption"><i>{user.profileStatus}</i></Typography>
                            )}
                        </Stack>
                    </Grid>
                    <Grid item sx={{ marginBottom: '15px', marginTop: '15px'}}>
                        <Stack
                            direction="row"
                            spacing={4}
                            justifyContent='center'
                            alignItems="center"
                            sx={{ width: "70vw" }}
                        >
                            <Chip
                                label={user.status === 'sponsor' ? ` ${user.dailyRsvp}/10 `:` ${user.dailyRsvp}/3 `}
                                color="primary"
                                variant={user.rsvpStatus?'filled':'outlined'}
                                deleteIcon={<RsvpIcon />}
                                onClick={handleFreeRsvp}
                                onDelete={handleFreeRsvp}
                                icon={<UpdateIcon />}
                            />
                            <Chip
                                label={` ${user.rsvp} `}
                                color="primary"
                                deleteIcon={<RsvpIcon />}
                                onClick={() => setOpenBuyDialog(true)}
                                onDelete={() => setOpenBuyDialog(true)}
                                icon={<AddCircleOutlineIcon />}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={8}>
                        <Button onClick={()=>setOpenNewGameDialog(true)}>
                            <Typography variant="h6">
                                <b>Новая игра</b>
                            </Typography>
                        </Button>
                    </Grid>
                    <Grid item xs={8}>
                        <Button endIcon={<GroupsIcon fontSize="small" />} onClick={()=>navigate(`/fnds`)}>
                            <b>Друзья</b>
                        </Button>
                    </Grid>
                    <Grid item xs={8}>
                        <Button
                            endIcon={<SportsEsportsIcon fontSize="small" />}
                            onClick={onOpenGamesPage}
                        >
                            <b>Мои игры</b>
                        </Button>
                    </Grid>
                    <Grid item xs={8}>
                        <Button onClick={()=>setOpenSettingsDialog(true)} endIcon={<SettingsIcon fontSize="small" />}>
                            <b>Настройки</b>
                        </Button>
                    </Grid>
                    {user.status !== 'sponsor' && <Grid item xs={8}>
                        <Button onClick={()=>setOpenSponsorDialog(true)} endIcon={<MonetizationOnSharpIcon fontSize="small" />}>
                            <b>Стать спонсором</b>
                        </Button>
                    </Grid>}
                </Grid>
            )}
            <EditInfoDialog
                open={editInfo}
                handleClose={handleCloseEditInfo}
                onSuccess={handleSuccessOpen}
                user={user}
            />
            <BuyRsvpDialog
                open={openBuyDialog}
                handleClose={handleCloseBuyDialog}
                onSuccess={handleSuccessOpen}
                user={user}
            />
            <SponsorDialog
                open={openSponsorDialog}
                handleClose={handleCloseSponsorDialog}
                onSuccess={handleSuccessOpen}
                user={user}
            />
            <SettingsDialog
                open={openSettingsDialog}
                handleClose={handleCloseSettingsDialog}
                onSuccess={handleSuccessOpen}
                user={user}
            />
            <NewGameDialog
                open={openNewGameDialog}
                handleClose={handleCloseNewGameDialog}
                onSuccess={handleSuccessOpen}
                user={user}
                socket={socket}
                inGams={false}
                mate={false}
            />
            <SuccessSnack
                open={successSnack}
                handleClose={handleSuccessClose}
                message={successMessage}
                severity={severity}
            />
        </React.Fragment>
    );
};
