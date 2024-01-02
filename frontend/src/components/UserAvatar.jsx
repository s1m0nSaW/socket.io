import { Badge, Avatar } from "@mui/material";
import React from "react";

import MonetizationOnSharpIcon from '@mui/icons-material/MonetizationOnSharp';
import PersonIcon from '@mui/icons-material/Person';

const UserAvatar = ({ user, onClickAva }) => {
    return (<>
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
                <Avatar onClick={onClickAva}>
                    <PersonIcon />
                </Avatar>
            ) : (
                <Avatar
                    alt={user.nickname}
                    src={`http://localhost:5000${user.pic}`}
                    onClick={onClickAva}
                />
            )}
        </Badge>:
        <>
            {user.pic === "none" ? (
                <Avatar onClick={onClickAva} sx={{margin:'10px'}}>
                    <PersonIcon />
                </Avatar>
            ) : (
                <Avatar
                    alt={user.nickname}
                    src={`http://localhost:5000${user.pic}`}
                    sx={{ margin:'10px' }}
                    onClick={onClickAva}
                />
            )}
        </>
        }
        </>);
};

export default UserAvatar;
