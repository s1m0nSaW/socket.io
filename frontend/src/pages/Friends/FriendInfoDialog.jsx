import { Button, CardContent, CardMedia, Dialog, DialogActions, Slide, Stack, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

import AccountCircle from '@mui/icons-material/AccountCircle';

import axios from '../../axios.js'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const FriendInfoDialog = ({ open, handleClose, friend, page, newGame, onFriendsOfFriend, remove, confirm, reject, deleteFriend, add }) => {
    const user = useSelector((state) => state.auth.data);
    const [ mutualFriends, setMutualFriends ] = React.useState([])

    React.useEffect(() => {
        const getFriends = async () => {
            const fields = {
                friends: friend.friends
            }
            if(user){
                await axios.post('/friends', fields).then((data)=>{
                    if(data){
                        setMutualFriends(data.data.filter(obj => user.friends.includes(obj._id)))
                    }
                }).catch((err)=>{
                    console.warn(err); 
                });
            }
        }
        if(friend){
            getFriends()
        }
    },[friend, user])

    return (
        <Dialog
            fullWidth
            maxWidth={'xs'}
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
        >
            {friend && user && <>
                {friend.pic === 'none'?
                    <Stack sx={{ height: 150, width:'100%' }} justifyContent='center' alignItems='center'>
                        <AccountCircle color="disabled" sx={{ fontSize: 80 }} />
                    </Stack>:
                    <CardMedia
                    sx={{ height: 300 }}
                    image={`http://localhost:5000${friend.pic}`}
                />}
                <CardContent>
                    <Typography variant="caption">{friend.nickname}</Typography>
                    <Typography gutterBottom variant="h6">
                    {friend.fullname === "none"
                                                ? "Имя не указано"
                                                : friend.fullname}
                    </Typography>
                    {friend && friend._id !== user._id && <Button size="small" onClick={onFriendsOfFriend}>{friend.friends.length} друзей ( общих {mutualFriends.length} )</Button>}
                    <Typography variant="body2">
                        {friend.age === "none"
                            ? "Возраст не указан"
                            : friend.age}<br/>
                        {friend.gender === "none"
                            ? "Пол не указан"
                            : friend.gender}
                    </Typography>
                    <Typography variant="caption">
                        {friend.city === "none"
                            ? "Город не указан"
                            : friend.city}
                    </Typography>
                </CardContent>
                {user._id === friend._id ?
                <DialogActions>
                    <Button size="small" onClick={handleClose}>Отмена</Button>
                </DialogActions>:
                <>
                {page === 'main' && <DialogActions>
                    <Button size="small" color="error" onClick={()=>remove(friend._id)}>Удалить из друзей</Button>
                    <Button size="small" onClick={handleClose}>Отмена</Button>
                    <Button size="small" onClick={()=> newGame(friend)}>Играть</Button>
                </DialogActions>}
                {page === 'reqIn' && <DialogActions>
                    <Button size="small" onClick={()=>confirm(friend._id)}>Принять</Button>
                    <Button size="small" onClick={()=>reject(friend._id)}>Отклонить</Button>
                    <Button size="small" onClick={handleClose}>Отмена</Button>
                </DialogActions>}
                {page === 'reqOut' && <DialogActions>
                    <Button size="small" onClick={()=>deleteFriend(friend._id)}>Отменить заявку</Button>
                    <Button size="small" onClick={handleClose}>Отмена</Button>
                </DialogActions>}
                {page === 'regular' && <DialogActions>
                    <Button size="small" onClick={()=>add(friend._id)}>Добавить</Button>
                    <Button size="small" onClick={handleClose}>Отмена</Button>
                </DialogActions>}
                </>}
            </>}
        </Dialog>
    );
};

export default FriendInfoDialog;
