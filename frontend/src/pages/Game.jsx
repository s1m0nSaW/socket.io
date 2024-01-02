import { Grid, IconButton, Paper, Stack, TextField } from "@mui/material";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import EmojiPicker from 'emoji-picker-react';

import SendIcon from '@mui/icons-material/Send';

import Header from "../components/Header";
import axios from "../axios.js";
import { authStatus, selectIsAuth } from "../redux/slices/auth";
import ActiveStep from "./Game/ActiveStep";
import Chat from "./Game/Chat";
import PlaceHolder from "./Game/PlaceHolder";
import WhoIsFirst from "./Game/WhoIsFirst";
import TheEnd from "./Game/TheEnd";
import icon from '../img/emoji.svg';
import styles from '../styles/Chat.module.css';

const GamePage = ({ socket }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const status = useSelector(authStatus);
    const isAuth = useSelector(selectIsAuth);
    const user = useSelector((state) => state.auth.data);
    const [ friend, setFriend ] = React.useState(null);
    const [ answered, setAnswered ] = React.useState();
    const [ connecting, setConnecting ] = React.useState(true);
    const [ game, setGame ] = React.useState();
    const [ questions, setQuestions ] = React.useState();
    const [ messages, setMessages ] = React.useState();
    const [ value, setValue ] = React.useState('');
    const [ rateGame, setRateGame ] = React.useState(false);
    const [ isOpen, setOpen ] = React.useState(false);

    const nextQuestion = () => {
        if(game.turn === user._id){
            setTurn(friend._id, game.activeStep + 1)
        } else {
            setTurn(user._id, game.activeStep + 1)
        }
    }

    const onEmojiClick = ({ emoji }) => setValue(`${value} ${emoji}`)

    const handleChangeMessage = (e) => {
        setOpen(false)
        setValue(e.target.value)
    }

    const updateGame = async (answeredId, activeStep) => {
        const fields = { answeredId, activeStep }
        await axios.post(`/up-game/${id}`, fields).catch((err)=>{console.warn(err);});
        socket.emit("updateGame", { gameId: id });
    }

    const newAnswered = async (id,step) => {
        const data = {
            questionId: questions[step]._id,
            gameId: game._id,
            turn: id,
            user1: game.user1,
            user2: game.user2,
            answer1: 'none',
            answer2: 'none',
        }
        await axios.post(`/answer`, data)
        .then((data)=>{
            updateGame(data.data._id, step)
        })
        .catch((err)=>console.warn(err));
    }

    const rateTheGame = () => {
        setRateGame(true)
        socket.emit("updateGame", { gameId: id });
    }

    const updateAnswered = async ( userId, answer ) => {
        if (userId === answered.user1){
            const fields = { answer1: answer, answer2: 'none' }
            await axios.post(`/up-answer/${answered._id}`, fields).catch((err)=>{console.warn(err);});
            socket.emit("upAnswered", { gameId: id, answeredId: answered._id })
        } else if (userId === answered.user2){
            const fields = { answer2: answer, answer1: 'none' }
            await axios.post(`/up-answer/${answered._id}`, fields).catch((err)=>{console.warn(err);});
            socket.emit("upAnswered", { gameId: id, answeredId: answered._id })
        }
        ;
    }

    const sendMessage = async () => {
        setOpen(false)
        const fields = {
            senderId: user._id,
            content: value,
            gameId: game._id,
            date: +new Date(),
        };
        await axios.post(`/message`, fields).catch((err)=>{console.warn(err);});
        socket.emit("sendMessage", fields);
        const data = {
            userId: friend._id,
            message: `Сообщение от ${user.nickname}`, 
            severity: 'info'
        }
        socket.emit("socketNotification", data);
        setValue('')
    };

    const setTurn = async (u_id, step) => {
        const fields = { userId: u_id }
        await axios.post(`/begin-game/${id}`, fields).catch((err)=>{console.warn(err);});
        newAnswered(u_id, step);
        socket.emit("updateGame", { gameId: id });
    }

    React.useEffect(()=>{
        const getGame = async () => {
            await axios.get(`/game/${id}`).then((data)=>{
                setGame(data.data)
            }).catch((err)=>{
                navigate(`/prfl/${user.nickname}`)
                console.warn(err);
            });
        };

        if(status !== 'loading'){
            if (!isAuth) {
                navigate(`/main`);
            } else {
                getGame();
            }
        };
    },[ isAuth, user, navigate, status, id ]);

    React.useEffect(()=>{
        const getQuestions = async () => {
            const fields = { theme: game.theme};
            await axios.post(`/questions`, fields).then((data)=>{
                setQuestions(data.data)
            }).catch((err)=>{console.warn(err);});
        };

        const getUser2 = async () => {
            let friend
            if(game.user1 === user._id){
                friend = game.user2
            } else { friend = game.user1 }
            await axios.get(`/get-user/${friend}`).then((data)=> setFriend(data.data)).catch((err)=>{console.warn(err);});
        };

        const getMessages = async () => {
            await axios.get(`/messages/${game._id}`).then((data)=> setMessages(data.data.reverse())).catch((err)=>{console.warn(err);});
        };

        const getAnswered = async () => {
            if(game.answered) {
                await axios.get(`/answer/${game.answered}`).then((data)=>{
                    setAnswered(data.data)
                }).catch((err)=>{
                    console.warn(err);
                });
            }
        };

        if(game) {
            getQuestions();
            getMessages();
            getAnswered();
            getUser2();
            setConnecting(true);
        };
    },[game, user]);

    React.useEffect(() => {
        const searchParams = { gameId: game?._id, userId: user?._id };
        socket.emit('join', searchParams);
    },[game, user, socket]);

    React.useEffect(() => {
        const getMessages = async () => {
            await axios.get(`/messages/${id}`).then((data)=> setMessages(data.data.reverse())).catch((err)=>{console.warn(err);});
        };
        socket.on("message", ({ data }) => {
            getMessages()
        });
    },[socket, id]);

    React.useEffect(() => {
        socket.on("deleteGame", ({ data }) => {
            navigate(`/prfl/${user.nickname}`)
        });
    },[socket, user, navigate]);

    React.useEffect(() => {
        const updateGame = async (_id) => {
            await axios.get(`/game/${_id}`).then((data)=>{
                setGame(data.data)
            }).catch((err)=>{console.warn(err);});
        };
        socket.on("update", ({ data }) => {
            updateGame(data.gameId)
        });
    },[socket]);

    React.useEffect(() => {
        const updateAnswered = async (id) => {
            await axios.get(`/answer/${id}`).then((data)=>{
                setAnswered(data.data)
            }).catch((err)=>{
                console.warn(err);
            });
        };
        socket.on("answered", ({ data }) => {
            updateAnswered(data.aswId)
        });
    },[socket]);

    return (<>
        {connecting === false ? 
            <PlaceHolder/>
            :
            <Grid container direction="column">
                <Grid item xs={12} style={{ position: "sticky", top: 0 }}>
                    <Header profile={true} back={'gams'}/>
                    <Paper sx={{padding:'10px'}}>
                    {game?.turn === null ? 
                    <WhoIsFirst user={user} friend={friend} setTurn={setTurn} game={game}/>
                    :
                    <Grid item>
                    {answered && game && rateGame === false ? <ActiveStep 
                        question={questions[game.activeStep]}
                        answered={answered} 
                        user={user}
                        game={game}
                        friend={friend}
                        updateAnswered={updateAnswered}
                        next={nextQuestion}
                        rateTheGame={rateTheGame}
                        questions={questions}
                    />: <TheEnd user={user} friend={friend} game={game} socket={socket}/>}
                    </Grid>}
                    <Stack 
                            direction='row'
                            justifyContent="space-evenly"
                            alignItems="center"
                            spacing={1}
                        >
                            <TextField
                                fullWidth   
                                size="small"
                                variant={"outlined"}
                                value={value}
                                label="Сообщение в чат"
                                onChange={handleChangeMessage}
                            />
                            <div className={styles.emoji}>
                                <img src={icon} alt="" onClick={() => setOpen(!isOpen)}/>
                                {isOpen && (<div className={styles.emojies}>
                                    <EmojiPicker onEmojiClick={onEmojiClick}/>
                                </div>)}
                            </div>
                            <IconButton disabled={value === ''} color="primary" size='small' onClick={sendMessage}><SendIcon/></IconButton>
                        </Stack>
                    </Paper>
                </Grid>
                    <Stack direction="column"
                        justifyContent="flex-start"
                        alignItems="stretch"
                        spacing={2} 
                        sx={{ overflow: 'auto', flex: 1, padding:'10px'}}>
                        <Chat messages={messages} user={user}/>
                    </Stack>
            </Grid>
        }
        </>);
};

export default GamePage;