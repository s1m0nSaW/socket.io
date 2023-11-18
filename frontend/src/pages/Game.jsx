import { Box, Button, CardActions, CardContent, CircularProgress, Grid, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import CircleIcon from '@mui/icons-material/Circle';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import DescriptionIcon from '@mui/icons-material/Description';

import Header from "../components/Header";
import axios from "../axios.js";
import { authStatus, selectIsAuth } from "../redux/slices/auth";
import ActiveStep from "./Game/ActiveStep";
import Chat from "./Game/Chat";

const GamePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const status = useSelector(authStatus);
    const isAuth = useSelector(selectIsAuth);
    const user = useSelector((state) => state.auth.data);
    const [ connecting, setConnecting ] = React.useState(true);
    const [ game, setGame ] = React.useState()
    const [ questions, setQuestions ] = React.useState()
    const [ messages, setMessages ] = React.useState()
    const [ answereds, setAnswereds ] = React.useState()
    const [ activeStep, setActiveStep ] = React.useState(0)

    React.useEffect(()=>{
        const getGame = async () => {
            await axios.get(`/game/${id}`)
            .then((data)=>{
                setGame(data.data)
            })
            .catch((err)=>{
                console.warn(err);
            });
        }

        if(status !== 'loading'){
            if (!isAuth) {
                navigate(`/main`);
            } else {
                getGame()
            }
        }
    },[ isAuth, user, navigate, status, id ])

    React.useEffect(()=>{
        const getQuestions = async () => {
            const fields = { theme: game.theme}
            await axios.post(`/questions`, fields)
            .then((data)=>{
                setQuestions(data.data)
            })
            .catch((err)=>{
                console.warn(err);
            });
        }

        const getMessages = async () => {
            await axios.get(`/messages/${game._id}`)
            .then((data)=>{
                console.log('messages:',data.data)
            })
            .catch((err)=>{
                console.warn(err);
            });
        }

        const getAnswereds = async () => {
            await axios.get(`/answer/${game._id}`)
            .then((data)=>{
                console.log('answereds:',data.data)
            })
            .catch((err)=>{
                console.warn(err);
            });
        }

        if(game) {
            getQuestions();
            getMessages();
            getAnswereds();
            setConnecting(true)
        }
    },[game])

    return (<>
        {connecting === false ? 
            <Grid
            container
            direction="column"
            justifyContent='center' 
            alignItems="center"
            spacing={2}
            sx={{ height: '100vh'}}
            >
                <Typography variant="h3" sx={{ color: 'primary.main' }}>
                    Ochem!
                </Typography>
                <Toolbar/>
                <CircularProgress/>
            </Grid>
            :
            <Box display="flex" flexDirection="column" height="100vh">
                <Header profile={true}/>
                <Grid container direction="column" style={{ flex: 1 }}>
                    <Button onClick={()=>console.log(game)}>Test</Button>
                    {game?.turn === null ? <>
                            <CardContent>
                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                Определите кто будет отвечать первый
                                </Typography>
                                <Typography variant="body1">
                                Камень, ножницы, бумага?
                                </Typography>
                            </CardContent>
                            <CardContent>
                                <Stack
                                    direction="row"
                                    justifyContent="space-around"
                                    alignItems="center"
                                    spacing={1}
                                >
                                    <IconButton size="large"><CircleIcon/></IconButton>
                                    <IconButton size="large"><ContentCutIcon/></IconButton>
                                    <IconButton size="large"><DescriptionIcon/></IconButton>
                                </Stack>
                            </CardContent>
                    </>:<>
                        {questions && 
                        <>
                            <ActiveStep question={questions[activeStep]}/>
                            <CardActions>

                            </CardActions>
                        </>}
                    </>}
                    <Grid item style={{ flexGrow: 1 }}>
                        <Chat messages={messages} user={user} game={game}/>
                    </Grid>
                </Grid>
            </Box>
        }
        </>);
};

export default GamePage;