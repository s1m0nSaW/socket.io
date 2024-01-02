import { Divider, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import React from "react";
import UserAvatar from "../../components/UserAvatar";

const FriendFromDialog = ({ friend, setFriend }) => {
    return (
        <React.Fragment>
            <ListItem alignItems="flex-start" onClick={()=>setFriend(friend)} disableGutters>
                <ListItemAvatar>
                    <UserAvatar user={friend}/>
                </ListItemAvatar>
                <ListItemText
                    primary={friend.fullname !== 'none' ? friend.fullname : 'Имя не указано'}
                    secondary={friend.nickname}
                />
            </ListItem>
            <Divider />
        </React.Fragment>
    );
};

export default FriendFromDialog;
