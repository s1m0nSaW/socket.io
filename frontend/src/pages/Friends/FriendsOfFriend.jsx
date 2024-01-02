import { CardContent, Dialog, IconButton, List, ListItem, ListItemAvatar, ListItemText, Slide } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

import CancelIcon from '@mui/icons-material/Cancel';

import axios from '../../axios.js'
import UserAvatar from "../../components/UserAvatar.jsx";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const FriendsOfFriends = ({ open, handleClose, friend, onInfoDialog }) => {
    const user = useSelector((state) => state.auth.data);
    const [ mutualFriends, setMutualFriends ] = React.useState([])
    const [ reqInFriends, setReqInFriends ] = React.useState([])
    const [ reqOutFriends, setReqOutFriends ] = React.useState([])
    const [ ordFriends, setOrdFriends ] = React.useState([])

    React.useEffect(() => {
        const getFriends = async () => {
            const fields = {
                friends: friend.friends
            }
            if(user){
                await axios.post('/friends', fields).then((data)=>{
                    if(data){
                        setMutualFriends(data.data.filter(obj => user.friends.includes(obj._id)))
                        let restFriends = data.data.filter(obj => !user.friends.includes(obj._id))
                        setReqInFriends(restFriends.filter(obj => user.reqIn.includes(obj._id)))
                        let restFriends2 = restFriends.filter(obj => !user.reqIn.includes(obj._id))
                        setReqOutFriends(restFriends2.filter(obj => user.reqOut.includes(obj._id)))
                        setOrdFriends(restFriends2.filter(obj => !user.reqOut.includes(obj._id)))
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
            <IconButton color="primary" sx={{ position: 'fixed', right:'15px', top: '15px'}} onClick={handleClose}>
                <CancelIcon />
            </IconButton>
            <CardContent>
                <List sx={{ width: "100%" }} >
                    {mutualFriends?.map((friend) => (
                        <div key={friend._id} onClick={()=>onInfoDialog(friend, 'main')}>
                            <ListItem alignItems="flex-start" disableGutters>
                                <ListItemAvatar>
                                    <UserAvatar user={friend}/>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={friend.fullname !== 'none' ? friend.fullname : 'Имя не указано'}
                                    secondary={friend.nickname}
                                />
                            </ListItem>
                        </div>
                    ))}
                    {reqInFriends?.map((friend) => (
                        <div key={friend._id} onClick={()=>onInfoDialog(friend, 'reqIn')}>
                            <ListItem alignItems="flex-start" disableGutters>
                                <ListItemAvatar>
                                    <UserAvatar user={friend}/>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={friend.fullname !== 'none' ? friend.fullname : 'Имя не указано'}
                                    secondary={friend.nickname}
                                />
                            </ListItem>
                        </div>
                    ))}
                    {reqOutFriends?.map((friend) => (
                        <div key={friend._id} onClick={()=>onInfoDialog(friend, 'reqOut')}>
                            <ListItem alignItems="flex-start" disableGutters>
                                <ListItemAvatar>
                                    <UserAvatar user={friend}/>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={friend.fullname !== 'none' ? friend.fullname : 'Имя не указано'}
                                    secondary={friend.nickname}
                                />
                            </ListItem>
                        </div>
                    ))}
                    {ordFriends?.map((friend) => (
                        <div key={friend._id} onClick={()=>onInfoDialog(friend, 'regular')}>
                            <ListItem alignItems="flex-start" disableGutters>
                                <ListItemAvatar>
                                    <UserAvatar user={friend}/>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={friend.fullname !== 'none' ? friend.fullname : 'Имя не указано'}
                                    secondary={friend.nickname}
                                />
                            </ListItem>
                        </div>
                    ))}
                </List>
            </CardContent>
        </Dialog>
    );
};

export default FriendsOfFriends;
