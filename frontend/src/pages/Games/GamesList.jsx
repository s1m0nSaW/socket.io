import { Divider, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, Stack, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import GroupsIcon from '@mui/icons-material/Groups';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import axios from "../../axios.js"
import { selectIsAuth, authStatus } from "../../redux/slices/auth";

const GameItem = ({ game, page, remove, accept, play }) => {
    const deleteGame = async (game) => {
        if (window.confirm('Вы действительно хотите удалить игру?')) {
            remove(game);
            await axios.delete(`/message/${game._id}`).catch((err)=>{console.warn(err);});
            await axios.delete(`/answer/${game._id}`).catch((err)=>{console.warn(err);});
        };
    }
    return (
        <React.Fragment>
            <ListItem 
            alignItems="flex-start" 
            secondaryAction={<>
                {page === 'games' && <IconButton edge="end" onClick={()=>deleteGame(game)}><ClearIcon/></IconButton>}
                {page === 'gamesIn' && <IconButton edge="end" onClick={()=>remove(game)}><ClearIcon/></IconButton>}
                {page === 'gamesOut' && <IconButton edge="end" onClick={()=>remove(game)}><ClearIcon/></IconButton>}
            </>
            }>
                {page === 'games' &&
                <ListItemIcon onClick={()=>play(game._id)}>
                    <PlayArrowIcon />
                </ListItemIcon>}
                {page === 'gamesIn' &&
                <ListItemIcon onClick={()=>accept(game)}>
                    <CheckIcon />
                </ListItemIcon>}
                <ListItemText
                    primary={game.gameName}
                    secondary={game.theme}
                />
            </ListItem>
            <Divider />
        </React.Fragment>
    )
}

const GamesList = ({ content, page, onSuccess, onUpdate, socket }) => {
    const user = useSelector((state) => state.auth.data);
    const isAuth = useSelector(selectIsAuth);
    const status = useSelector(authStatus);
    const navigate = useNavigate();
    const [ games, setGames ] = React.useState(null);

    const getGames = async () => {
        const fields = {
            games: content
        }
        await axios.post('/games', fields).then((data)=>{
            setGames(data.data)
        }).catch((err)=>{
            console.warn(err); 
        });
    }
    
    const removeGame = async (game) => {
        socket.emit("removeGame", { gameID: game._id});
        await axios.delete(`/game/${game._id}`).then((data)=>{
            if(data) {
                onSuccess('Игра удалена', 'success')
                if(user._id === game.user1){
                    onUpdate(game.user2, `${user.nickname} удалил игру`, 'error')
                } else {
                    onUpdate(game.user1, `${user.nickname} удалил игру`, 'error')
                }
                getGames()
            }
        }).catch((err)=>{
            console.warn(err); 
        });
    }

    const acceptGame = async (game) => {
        await axios.get(`/join/${game._id}`).then((data)=>{
            if(data) {
                onSuccess('Игра принята', 'success')
                if(user._id === game.user1){
                    onUpdate(game.user2, `${user.nickname} согласен играть`, 'success')
                } else {
                    onUpdate(game.user1, `${user.nickname} согласен играть`, 'success')
                }
                getGames()
            }
        }).catch((err)=>{
            console.warn(err); 
        });
    }

    const playGame = (id) => {
        navigate(`/game/${id}`)
    }

    React.useEffect(()=>{
        const getGames = async () => {
            const fields = {
                games: content
            }
            await axios.post('/games', fields).then((data)=>{
                setGames(data.data)
            }).catch((err)=>{
                console.warn(err); 
            });
        }

        if(status !== 'loading'){
            if (!isAuth) {
                navigate(`/main`);
            } else {
                getGames()
            }
        }
    },[ isAuth, user, navigate, status, content ])

    return (
        <>
            {games && <>
                {games.length !== 0 ? (
                    <List sx={{ width: "100%" }} dense>
                        {games.map((game) => (
                            <GameItem 
                                key={game._id} 
                                game={game} 
                                page={page} 
                                remove={removeGame} 
                                accept={acceptGame} 
                                play={playGame}
                            />
                            ))}
                    </List>
                ):
                <Stack
                    direction="column"
                    justifyContent="space-evenly"
                    alignItems="center">
                    <Toolbar/>
                    <GroupsIcon color="disabled" sx={{ fontSize: 40 }} />
                    {page === 'games' && <>
                        <Typography variant="subtitle1">У Вас ещё нет игр</Typography>
                        <Typography variant="caption">Вы можете создать новую игру в странице профиль</Typography>
                    </>}
                    {page === 'gamesIn' && <>
                        <Typography variant="subtitle1">У Вас нет входящих заявок на игры</Typography>
                        <Typography variant="caption">Вы можете создать новую игру в странице профиль</Typography>
                    </>}
                    {page === 'gamesOut' && <>
                        <Typography variant="subtitle1">У Вас нет отправленных заявок на игры</Typography>
                        <Typography variant="caption">Вы можете создать новую игру в странице профиль</Typography>
                    </>}
                </Stack>
                }
            </>}
        </>
    );
};

export default GamesList;
