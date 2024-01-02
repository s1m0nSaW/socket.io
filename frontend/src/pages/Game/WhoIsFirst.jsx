import { CardContent, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import UserAvatar from "../../components/UserAvatar";

const WhoIsFirst = ({ user, friend, setTurn, game }) => {
    return (
        <Grid item>
        {user._id === game.user1 ?
            <>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Выберите игрока
                </Typography>
                <Typography variant="body1">
                Определите кто будет отвечать первый
                </Typography>
            </CardContent>
            <CardContent>
                <Stack direction="row" justifyContent="space-around" alignItems="center" spacing={1}>
                    {user&&
                    <Stack direction="column" justifyContent="center" alignItems="center" spacing={1}>
                        <UserAvatar user={user} onClickAva={()=>setTurn(user._id, 0)}/>
                        <Typography>{user.nickname}</Typography>
                    </Stack>}
                    {friend&&
                    <Stack direction="column" justifyContent="center" alignItems="center" spacing={1}>
                        <UserAvatar user={friend} onClickAva={()=>setTurn(friend._id, 0)}/>
                        <Typography>{friend.nickname}</Typography>
                    </Stack>}
                </Stack>
            </CardContent>
            </>:<>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Выбор игрока
                </Typography>
                <Typography variant="body1">
                Пригласившему игроку нужно сделать выбор кто будет отвечать первый
                </Typography>
            </CardContent>
            </>}
        </Grid>
    );
};

export default WhoIsFirst;
