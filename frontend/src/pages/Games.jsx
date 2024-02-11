import React from "react";
import { Badge, Box, Fab, Tab, Tabs} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import GamesList from "./Games/GamesList";
import SuccessSnack from "../components/SuccessSnack";
import NewGameDialog from "./Profile/NewGameDialog";
import { fetchAuthMe, authStatus, selectIsAuth } from "../redux/slices/auth";
import axios from '../axios.js';

import AddIcon from '@mui/icons-material/Add';
import AllGames from "./Games/AllGames.jsx";

const Games = ({ socket }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const status = useSelector(authStatus);
    const isAuth = useSelector(selectIsAuth);
    const user = useSelector((state) => state.auth.data);
    const [successSnack, setSuccessSnack] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');
    const [severity, setSeverity] = React.useState('info');
    const [ value, setValue ] = React.useState("one");
    const [openNewGameDialog, setOpenNewGameDialog] = React.useState(false);
    const [incomingRequestsCount, setIncomingRequestsCount] = React.useState(0);
    const [outgoingRequestsCount, setOutgoingRequestsCount] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleSuccessOpen = (message, severity) => {
        setSuccessMessage(message);
        setSeverity(severity);
        setSuccessSnack(true);
        dispatch(fetchAuthMe());
    };

    const handleCloseNewGameDialog = () => {
        setOpenNewGameDialog(false)
    };

    const onUpdateUserGames = (userID, message, severity) => {
        socket.emit("upGames", { userId: userID });
        const data = {
            userId: userID,
            message: message, 
            severity: severity,
        }
        socket.emit("socketNotification", data);
    };

    const handleSuccessClose = () => {
        setSuccessSnack(false);
    };

    React.useEffect(()=>{
        const getIncoming = async () => {
            const fields = {
                games: user.gamesIn
            }
            await axios.post('/games', fields).then((data)=>{
                setIncomingRequestsCount(data.data.length)
            }).catch((err)=>{
                console.warn(err); 
            });
        }
        const getOutgoing = async () => {
            const fields = {
                games: user.gamesOut
            }
            await axios.post('/games', fields).then((data)=>{
                setOutgoingRequestsCount(data.data.length)
            }).catch((err)=>{
                console.warn(err); 
            });
        }
        if(status !== 'loading'){
            if (!isAuth) {
                navigate(`/main`);
            } 
            if(user){
                getIncoming();
                getOutgoing();
            }
        }
    },[ isAuth, user, navigate, status, socket ]);

    React.useEffect(() => {
        socket.on("updateGames", ({ data }) => {
            dispatch(fetchAuthMe());
        });
    },[socket, dispatch]);

    return (
        <Box position='relative'>
            <Header profile={true} back={true}/>
            <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="scrollable"
            scrollButtons="auto"
            >
                <Tab value="zero" label="Все игры" />
                <Tab value="one" label="Игры" />
                <Tab value="two" label={
                    <Badge badgeContent={incomingRequestsCount} color="primary">
                        Входящие заявки
                    </Badge>
                } />
                <Tab value="three" label={
                    <Badge badgeContent={outgoingRequestsCount} color="primary">
                        Исходящие заявки
                    </Badge>
                } />
            </Tabs>
            {user && <>
            {value === 'zero' && <AllGames/>}
            {value === 'one' && <GamesList content={user.games} page={'games'} onSuccess={handleSuccessOpen} onUpdate={onUpdateUserGames} socket={socket}/>}
            {value === 'two' && <GamesList 
                content={user.gamesIn}
                page={'gamesIn'} 
                onSuccess={handleSuccessOpen} 
                onUpdate={onUpdateUserGames}
                socket={socket}
            />}
            {value === 'three' && <GamesList 
                content={user.gamesOut} 
                page={'gamesOut'} 
                onSuccess={handleSuccessOpen} 
                onUpdate={onUpdateUserGames}
                socket={socket}
            />}
            </>}
            <Fab color="primary" aria-label="add" sx={{ position:'absolute', right:'16px', bottom: '16px'}} onClick={()=>setOpenNewGameDialog(true)}>
                <AddIcon />
            </Fab>
            <SuccessSnack
                open={successSnack}
                handleClose={handleSuccessClose}
                message={successMessage}
                severity={severity}
            />
            <NewGameDialog
                open={openNewGameDialog}
                handleClose={handleCloseNewGameDialog}
                onSuccess={handleSuccessOpen}
                user={user}
                socket={socket}
                inGams={true}
                mate={false}
            />
        </Box>
    );
};

export default Games;
