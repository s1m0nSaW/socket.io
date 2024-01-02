import { Divider, Grid, List, ListItem, ListItemAvatar, ListItemText, Stack, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import GroupsIcon from '@mui/icons-material/Groups';

import axios from "../../axios.js"
import { selectIsAuth, authStatus } from "../../redux/slices/auth";
import UserAvatar from "../../components/UserAvatar.jsx";

const FriendItem = ({ friend, page, onInfoDilog }) => {
    
    return (
        <React.Fragment>
            <ListItem alignItems="flex-start" onClick={() => onInfoDilog(friend, page)}>
                <ListItemAvatar>
                    <UserAvatar user={friend} />
                </ListItemAvatar>
                <ListItemText
                    primary={friend.fullname !== 'none' ? friend.fullname : 'Имя не указано'}
                    secondary={friend.nickname}
                />
            </ListItem>
            <Divider />
        </React.Fragment>
    );
}

const FriendsList = ({ content, page, onInfoDialog }) => {
    const user = useSelector((state) => state.auth.data);
    const isAuth = useSelector(selectIsAuth);
    const status = useSelector(authStatus);
    const navigate = useNavigate();
    const [ friends, setFriends ] = React.useState(null);
    

    React.useEffect(()=>{
        
        const getFriends = async () => {
            const fields = {
                friends: content
            }
            await axios.post('/friends', fields).then((data)=>{
                setFriends(data.data)
            }).catch((err)=>{
                console.warn(err); 
            });
        }

        if(status !== 'loading'){
            if (!isAuth) {
                navigate(`/main`);
            } else {
                getFriends()
            }
        }
    },[ isAuth, user, navigate, status, content ])

    return (
        <>
            {friends && <>
                {friends.length !== 0 ? (
                    <Grid container>
                        <List sx={{ width: "100%" }}>
                            {friends.map((friend) => (
                                <FriendItem 
                                key={friend._id} 
                                friend={friend} 
                                page={page} 
                                onInfoDilog={onInfoDialog}
                                />
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
                    {page === 'main' && <>
                        <Typography variant="subtitle1">У Вас ещё нет друзей</Typography>
                        <Typography variant="caption">Вы можете найти друзей во вкладке поиск</Typography>
                    </>}
                    {page === 'reqIn' && <>
                        <Typography variant="subtitle1">У Вас нет заявок на добавление в друзья</Typography>
                        <Typography variant="caption">Вы можете найти друзей во вкладке поиск</Typography>
                    </>}
                    {page === 'reqOut' && <>
                        <Typography variant="subtitle1">У Вас нет заявок на добавление в друзья</Typography>
                        <Typography variant="caption">Вы можете найти друзей во вкладке поиск</Typography>
                    </>}
                </Stack>
                }
            </>}
        </>
    );
};

export default FriendsList;
