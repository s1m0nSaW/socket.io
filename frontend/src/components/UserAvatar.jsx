import { Badge, Avatar } from "@mui/material";
import React from "react";

import MonetizationOnSharpIcon from '@mui/icons-material/MonetizationOnSharp';
import PersonIcon from '@mui/icons-material/Person';


const UserAvatar = ({ user, onClickAva }) => {
    // const src = `http://localhost:5000${user.pic}`
    const src=`http://5.35.90.128/api${user.pic}`
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
                    src={src}
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
                    src={src}
                    sx={{ margin:'10px' }}
                    onClick={onClickAva}
                />
            )}
        </>
        }
        </>);
};

export default UserAvatar;
