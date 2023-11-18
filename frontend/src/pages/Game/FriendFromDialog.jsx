import { Avatar, Divider, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import React from "react";

const FriendFromDialog = ({ friend, setFriend }) => {
    return (
        <React.Fragment>
            <ListItem alignItems="flex-start" onClick={()=>setFriend(friend)} >
                <ListItemAvatar>
                    <Avatar
                        alt={friend.nickname}
                        src={`http://localhost:5000${friend.pic}`}
                    />
                </ListItemAvatar>
                <ListItemText
                    primary={friend.fullname}
                    secondary={friend.city}
                />
            </ListItem>
            <Divider />
        </React.Fragment>
    );
};

export default FriendFromDialog;
