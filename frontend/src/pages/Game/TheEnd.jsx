import { Button, CircularProgress, Divider, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Rating, Stack, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

import axios from '../../axios.js'

import DeleteIcon from '@mui/icons-material/Delete';
import UserAvatar from "../../components/UserAvatar.jsx";

const TheEnd = ({ user, friend, game, socket }) => {
    const navigate = useNavigate();
    const [ connecting, setConnecting ] = React.useState(false);
    const [ answereds, setAnswereds ] = React.useState();
    const [ value, setValue ] = React.useState(1);
    const [ rating, setRating ] = React.useState();
    const [ disabled, setDisabled ] = React.useState(false);

    function countCorrectAnswers(personId) {
        try {
            let count = 0;
            answereds?.forEach((answered) => {
                if(answered.correct === 'none'){
                    if (answered.turn !== personId) {
                        if (answered.answer1 === answered.answer2) {
                            count++;
                        }
                    }
                } else {
                    if (answered.user1 === personId) {
                        if (answered.answer1 === answered.correct) {
                            count++;
                        }
                    } else {
                        if (answered.answer2 === answered.correct) {
                            count++;
                        }
                    }
                }
            });
            return count;
        } catch (error) {
            console.log(error)
        }
    }

    const onUpdateUserGames = (userID, message, severity) => {
        socket.emit("upGames", { userId: userID });
        const data = {
            userId: userID,
            message: message, 
            severity: severity,
        }
        socket.emit("socketNotification", data);
    };

    const removeGame = async () => {
        if (window.confirm('Удалить все данные игры, включая переписку?')) {
            socket.emit("removeGame", { gameID: game._id});
            await axios.delete(`/game/${game._id}`).then((data)=>{
                if(data) {
                    if(user._id === game.user1){
                        onUpdateUserGames(game.user2, `${user.nickname} удалил игру`, 'error')
                    } else {
                        onUpdateUserGames(game.user1, `${user.nickname} удалил игру`, 'error')
                    }
                    navigate(`/prfl/${user.nickname}`);
                }
            }).catch((err)=>{
                console.warn(err); 
            });
        }
    }

    const RateGame = async () => {
        const fields = {
            theme: rating.theme,
            rate: value,
            gameId: game._id,
        }
        setDisabled(true)
        await axios.post(`/up-rating/${rating._id}`, fields).then((data)=>{
            console.log(data)
        }).catch((err)=>{
            console.warn(err);
        });
        const data = {
            userId: friend._id,
            message: `${user.nickname} оценил игру в ${value} звезд`, 
            severity: 'success',
        }
        socket.emit("socketNotification", data);
    }

    React.useEffect(()=>{
        const getRating = async () => {
            const fields = { theme: game.theme}
            await axios.post(`/get-rating`, fields).then((data)=>{
                setRating(data.data)
            }).catch((err)=>{
                console.warn(err);
            });
        };
        const getAnswereds = async () => {
            await axios.get(`/answereds/${game._id}`).then((data)=>{
                setAnswereds(data.data)
            }).catch((err)=>{
                console.warn(err);
            });
        };
        if (game) {
            getRating()
            getAnswereds()
            setConnecting(true)
        }
    },[game])

    return (
        <>
        { !connecting ? <Stack direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{padding:'30px'}}>
            <CircularProgress/>
        </Stack>:<>
            {rating !== undefined && 
            <Grid item>
            <IconButton color="warning" sx={{ position: 'absolute', right:'10px'}} onClick={removeGame}>
                <DeleteIcon />
            </IconButton>
                <Stack direction='column' justifyContent='center' alignItems='center' spacing={2} sx={{padding:'20px'}}>
                    <Typography variant="h6">Вы играли в игру {rating.theme}</Typography>
                    <Stack direction='row' justifyContent='center' alignItems='center' spacing={2}>
                        <Stack direction='row' justifyContent='center' alignItems='center' spacing={0}>
                            <Typography variant="caption">Рейтинг:</Typography>
                            <Rating name="size-small" value={rating.rating} readOnly size="small" />
                        </Stack>
                        <Typography variant="caption">Оценок:
                            {rating.count}
                        </Typography>
                    </Stack>
                </Stack>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    {friend &&
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                        {friend && <UserAvatar user={friend}/>}
                        </ListItemAvatar>
                        <ListItemText
                        primary={friend?.nickname}
                        secondary={`Отгадано: ${countCorrectAnswers(friend._id)}`}
                        />
                    </ListItem>}
                    <Divider variant="inset" component="li" />
                    {user && 
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                        {user && <UserAvatar user={user}/>}
                        </ListItemAvatar>
                        <ListItemText
                        primary={user?.nickname}
                        secondary={`Отгадано: ${countCorrectAnswers(user._id)}`}
                        />
                    </ListItem>}
                </List>
                {rating.games.includes(game._id) ?
                <Stack direction='column' justifyContent='center' alignItems='center' spacing={2} sx={{padding:'20px'}}>
                    <Typography align='center'>Спасибо<br/>
                    <Typography variant='caption'>Вы уже поставили оценку</Typography>
                    </Typography>
                    <Rating
                    value={rating.rating} 
                    max={5} 
                    size="large"
                    readOnly />
                </Stack>
                :<>
                    {game.user1 === user._id ?
                    <Stack direction='column' justifyContent='center' alignItems='center' spacing={2} sx={{padding:'20px'}}>
                        {friend !== null && <Typography align='center'>Оцените игру вместе с {friend.nickname}<br/>
                        <Typography variant='caption'>Только Вы можете поставить оценку</Typography>
                        </Typography>}
                        <Rating
                        value={value} 
                        max={5} 
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}
                        size="large" />
                        <Button disabled={disabled} variant='contained' onClick={RateGame}>Оценить</Button>
                    </Stack>:
                    <Stack direction='column' justifyContent='center' alignItems='center' spacing={2} sx={{padding:'20px'}}>
                        <Typography align='center'>Оцените игру вместе<br/>
                        <Typography variant='caption'>Только {friend?.nickname} может поставить оценку</Typography>
                        </Typography>
                        <Rating
                        value={rating.rating} 
                        max={5} 
                        size="large"
                        readOnly />
                    </Stack>}
                </>
                }
            </Grid>}</>}
        </>
    );
};

export default TheEnd;
