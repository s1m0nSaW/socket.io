import { Box, Button, Card, CardContent, CardMedia, DialogActions, Grid, Stack, TextField, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';

import axios from '../../axios.js';

const SearchPage = ({ onSuccess }) => {
    const me = useSelector((state) => state.auth.data);
    const [ nick, setNick ] = React.useState('');
    const [ user, setUser ] = React.useState('none');
    const [ finded, setFinded ] = React.useState(false);
    
    const handleChange = ( event ) => {
        setNick(event.target.value);
    };

    const searchUser = async () => {
        await axios.get(`/find-user/${nick}`).then((data) => {
            if(data){
                setFinded(true);
                setUser(data.data);
            }
        }).catch((err)=>{
            console.log(err);
            setFinded(true);
            setUser('none');
        });
    };

    const addFriend = async (id) => {
        await axios.get(`/add-friend/${id}`)
        .then(()=>{
            onSuccess('Заявка на добавление в друзья отправлена', 'success')
        })
        .catch((err)=>{
            console.log(err);
            onSuccess('Не удалось отправить заявку на добавление в друзья', 'error')
        });
    }

    return (
        <Grid container alignItems='center' justifyContent='center' direction='column'>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', marginTop: '15px' }}>
                <AccountCircle color="primary" sx={{ mr: 1, my: 0.5 }} />
                <TextField value={nick} onChange={handleChange} color="primary" id="input-with-sx" label="Введите никнейм" variant="standard" focused />
                <Button variant="contained" color="primary" onClick={() => searchUser()}>
                    <SearchIcon/>
                </Button>
            </Box>
            <Toolbar/>
            {finded === false ? 
                <Stack
                    direction="column"
                    justifyContent="space-evenly"
                    alignItems="center">
                    <Toolbar/>
                    <SearchIcon color="disabled" sx={{ fontSize: 40 }} />
                    <Typography variant="subtitle1">Найдите своих друзей</Typography>
                    <Typography variant="caption">Введите никнейм друга и нажмите на поиск</Typography>
                </Stack>
            :
            <>{user === 'none' ?
                <Stack
                    direction="column"
                    justifyContent="space-evenly"
                    alignItems="center">
                    <Toolbar/>
                    <AccountCircle color="disabled" sx={{ fontSize: 40 }} />
                    <Typography variant="subtitle1">Пользователь не найден</Typography>
                    <Typography variant="caption">Попробуйте ввести никнейм ещё раз</Typography>
                </Stack>
                :
                <Card sx={{ width: 300 }}>
                    {user.pic === 'none'?
                    <Stack sx={{ height: 150, width:'100%' }} justifyContent='center' alignItems='center'>
                        <AccountCircle color="disabled" sx={{ fontSize: 80 }} />
                    </Stack>:
                    <CardMedia
                    sx={{ height: 300 }}
                    image={`http://localhost:5000${user.pic}`}
                    />}
                    <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                        {user.fullname === "none"
                                                    ? "Имя не указано"
                                                    : user.fullname}
                        </Typography>
                        <Typography variant="body2">
                            {user.age === "none"
                                ? "Возраст не указан"
                                : user.age}<br/>
                            {user.gender === "none"
                                ? "Не указан"
                                : user.gender}
                        </Typography>
                        <Typography variant="caption">
                            {user.city === "none"
                                ? "Город не указан"
                                : user.city}
                        </Typography>
                    </CardContent>
                    {!me.friends.includes(user._id) && 
                    <> 
                        {!me.reqOut.includes(user._id) && 
                        <>
                            {!me.reqIn.includes(user._id) && <DialogActions>
                                <Button size="small" onClick={()=>addFriend(user._id)}>Добавить в друзья</Button>
                            </DialogActions>}
                        </>}
                    </>}
                </Card>
            }</>}
        </Grid>
    );
};

export default SearchPage;
