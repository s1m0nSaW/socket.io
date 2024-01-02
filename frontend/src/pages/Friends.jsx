import React from "react";
import { Badge, Tab, Tabs} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import FriendsList from "./Friends/FriendsList";
import SearchPage from "./Friends/SearchPage";
import SuccessSnack from "../components/SuccessSnack";
import { fetchAuthMe, authStatus, selectIsAuth } from "../redux/slices/auth";
import NewGameDialog from "./Profile/NewGameDialog";
import axios from '../axios.js';
import FriendInfoDialog from "./Friends/FriendInfoDialog.jsx";
import FriendsOfFriends from "./Friends/FriendsOfFriend.jsx";

const Friends = ({ socket }) => {
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
    const [mate, setMate] = React.useState(false);
    const [incomingRequestsCount, setIncomingRequestsCount] = React.useState(0);
    const [outgoingRequestsCount, setOutgoingRequestsCount] = React.useState(0);
    const [ openInfo, setOpenInfo ] = React.useState(false);
    const [ openFriendsOfFriend, setOpenFriendsOfFriends ] = React.useState(false);
    const [ friend, setFriend ] = React.useState();
    const [ page, setPage ] = React.useState();

    const handleCloseInfo = () => {
        setOpenInfo(false)
    }

    const handleOpenInfoDialog = (friend, page) => {
        setOpenFriendsOfFriends(false)
        setPage(page)
        setFriend(friend)
        setOpenInfo(true)
    }

    const handleOpenFriendsOfFriends = () => {
        setOpenInfo(false)
        setOpenFriendsOfFriends(true)
    }

    const handleCloseFriendsOfFriends = () => {
        setOpenFriendsOfFriends(false)
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleSuccessOpen = (message, severity) => {
        setSuccessMessage(message);
        setSeverity(severity);
        setSuccessSnack(true);
        dispatch(fetchAuthMe());
    };

    const handleSuccessClose = () => {
        setSuccessSnack(false);
    };

    const handleOpenNewGameDialog = (id) => {
        setOpenInfo(false)
        setMate(id)
        setOpenNewGameDialog(true)
    }

    const handleCloseNewGameDialog = () => {
        setOpenNewGameDialog(false)
    }

    const removeFriend = async (id) => {
        try {
            await axios.delete(`/friends/${id}`);
            onUpdateUserGames(id, `Вас удалили из списка друзей`, 'error');
            handleSuccessOpen('Пользователь удален из списка друзей', 'success');
        } catch (err) {
            console.warn(err);
            handleSuccessOpen('Не удалось удалить пользователя из списка друзей', 'error');
        } finally {
            setOpenInfo(false)
        }
    }

    const confirmRequest = async (id) => {
        try {
            await axios.get(`/conf-req/${id}`);
            onUpdateUserGames(id, `${user.nickname} добавил вас в друзья`, 'success');
            handleSuccessOpen('Пользователь добавлен в список друзей', 'success');
        } catch (err) {
            console.warn(err);
            handleSuccessOpen('Не удалось добавить пользователя в список друзей', 'error');
        } finally {
            setOpenInfo(false)
        }
    }

    const rejectRequest = async (id) => {
        try {
            await axios.get(`/reject-req/${id}`);
            onUpdateUserGames(id, `${user.nickname} отклонил вашу заявку`, 'error');
            handleSuccessOpen('Заявка отклонена', 'success');
        } catch (err) {
            console.warn(err);
            handleSuccessOpen('Не удалось отклонить заявку', 'error');
        } finally {
            setOpenInfo(false)
        }
    }

    const deleteRequest = async (id) => {
        try {
            await axios.delete(`/request/${id}`);
            onUpdateUserGames(id, `${user.nickname} удалил заявку`, 'error');
            handleSuccessOpen('Заявка удалена', 'success');
        } catch (err) {
            console.warn(err);
            handleSuccessOpen('Не удалось удалить заявку', 'error');
        } finally {
            // Установка состояния следует делать в блоке finally,
            // чтобы оно выполнялось независимо от того, была ли ошибка
            setOpenInfo(false);
        }
    }

    const addFriend = async (id) => {
        try {
            await axios.get(`/add-friend/${id}`);
            onUpdateUserGames(id, `${user.nickname} хочет добавить вас в друзья`, 'info');
            handleSuccessOpen('Заявка на добавление в друзья отправлена', 'success');
        } catch (err) {
            console.warn(err);
            handleSuccessOpen('Не удалось отправить заявку на добавление в друзья', 'error');
        } finally {
            setOpenInfo(false);
        }
    }

    const onUpdateUserGames = (userID, message, severity) => {
        socket.emit("upGames", { userId: userID });
        const fields = {
            userId: userID,
            message, 
            severity,
        }
        socket.emit("socketNotification", fields);
    };

    React.useEffect(()=>{
        const getIncoming = async () => {
            const fields = {
                friends: user.reqIn
            }
            await axios.post('/friends', fields).then((data)=>{
                setIncomingRequestsCount(data.data.length)
            }).catch((err)=>{
                console.warn(err); 
            });
        }
        const getOutgoing = async () => {
            const fields = {
                friends: user.reqOut
            }
            await axios.post('/friends', fields).then((data)=>{
                setOutgoingRequestsCount(data.data.length)
            }).catch((err)=>{
                console.warn(err); 
            });
        }
        if(status !== 'loading'){
            if (!isAuth) {
                navigate(`/main`);
            }
        }
        if(user){
            getIncoming();
            getOutgoing();
        }
    },[ isAuth, user, navigate, status ])

    React.useEffect(() => {
        socket.on("updateGames", ({ data }) => {
            dispatch(fetchAuthMe());
        });
    },[socket, dispatch]);

    return (
        <React.Fragment>
            <Header profile={true} back={true}/>
            <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="scrollable"
            scrollButtons="auto"
            >
                <Tab value="four" label="Поиск" />
                <Tab value="one" label="Друзья" />
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
            {value === 'one' && 
            <FriendsList content={user.friends} page={'main'} onInfoDialog={handleOpenInfoDialog} />}
            {value === 'two' && <FriendsList content={user.reqIn} page={'reqIn'} onInfoDialog={handleOpenInfoDialog} />}
            {value === 'three' && <FriendsList content={user.reqOut} page={'reqOut'} onInfoDialog={handleOpenInfoDialog}/>}
            {value === 'four' && <SearchPage onSuccess={handleSuccessOpen} onUpdate={onUpdateUserGames}/>}
            </>}
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
                inGams={false}
                mate={mate}
            />
            <FriendInfoDialog
                open={openInfo}
                handleClose={handleCloseInfo}
                friend={friend}
                page={page}
                newGame={handleOpenNewGameDialog}
                onFriendsOfFriend={handleOpenFriendsOfFriends}
                reject={rejectRequest}
                remove={removeFriend}
                deleteFriend={deleteRequest}
                add={addFriend}
                confirm={confirmRequest}
            />
            <FriendsOfFriends
                friend={friend}
                open={openFriendsOfFriend}
                handleClose={handleCloseFriendsOfFriends}
                onInfoDialog={handleOpenInfoDialog}
            />
        </React.Fragment>
    );
};

export default Friends;
