import { Button, Grid, Paper, Stack, Tab, TableContainer, Tabs, TextField, Typography } from '@mui/material';
import React from 'react';

import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SearchIcon from '@mui/icons-material/Search';

import axios from "../axios.js";
import NewQuestion from './Admin/NewQuestion.jsx';
import NewRating from './Admin/NewRating.jsx';
import QuestionsTable from './Admin/QuestionsTable.jsx';
import UsersTable from './Admin/UsersTable.jsx';
import StatsTable from './Admin/StatsTable.jsx';

export const Admin = () => {
    const [ pass1, setPass1 ] = React.useState('');
    const [ pass2, setPass2 ] = React.useState('');
    const [ pass3, setPass3 ] = React.useState('');
    const [ stats, setStats ] = React.useState();
    const [ users, setUsers ] = React.useState();
    const [ questions, setQuestions ] = React.useState();
    const [ openDialog, setOpenDialog ] = React.useState(false);
    const [ openNewRating, setOpenNewRating ] = React.useState(false);
    const [ ratings, setRatings ] = React.useState();
    const [value, setValue] = React.useState('1');
    const [ nick, setNick ] = React.useState('');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeNick = ( event ) => {
        setNick(event.target.value);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false)
    };

    const handleCloseNewRaiting = () => {
        setOpenNewRating(false)
    };

    const handleChangeWord1 = (e) => {
        const w = e.target.value
        setPass1(w)
    };

    const handleChangeWord2 = (e) => {
        const w = e.target.value
        setPass2(w)
    };

    const handleChangeWord3 = (e) => {
        const w = e.target.value
        setPass3(w)
    };

    function getStringsByValue(arr, value) {
        return arr.filter((element) => {
          return element.nickname === value;
        });
      }

    const searchUser = () => {
        var search = getStringsByValue(users, nick)
        setUsers(search)
    }

    const getRatings = async () => {
        const fields = {
            pass1: pass1,
            pass2: pass2,
            pass3: pass3,
        }
        await axios.post('/ratings', fields).then((data) => setRatings(data.data)).catch(err => console.warn(err))
    };

    const openRating = async () => {
        getRatings()
        setOpenNewRating(true)
    };

    const mans = users?.filter(obj => obj.gender === "Мужской");
    const womans = users?.filter(obj => obj.gender === "Женский");
    const users18 = users?.filter(obj => obj.age === "18‑24 года");
    const users25 = users?.filter(obj => obj.age === "25‑34 года");
    const users35 = users?.filter(obj => obj.age === "35‑44 года");
    const users45 = users?.filter(obj => obj.age === "45-54 года");
    const users55 = users?.filter(obj => obj.age === "старше 55 лет");

    const getQuests = async () => {
        const fields = {
            pass1: pass1,
            pass2: pass2,
            pass3: pass3,
        };
        await axios.post('/quests', fields)
        .then((data) => {
            let quests = data.data;
            setQuestions(quests);
        })
        .catch(err => console.warn(err));
    };

    const newQuestion = async (data) => {
        const fields = {
            ...data,
            pass1: pass1,
            pass2: pass2,
            pass3: pass3,
        }
        await axios.post('/question', fields)
        .then((data) => {
            if(data){
                getQuests()
            }
        })
        .catch(err => console.warn(err));
    };

    const newRaiting = async (data) => {
        const fields = {
            ...data,
            pass1: pass1,
            pass2: pass2,
            pass3: pass3,
        }
        await axios.post('/rating', fields)
        .then((data) => {
            if(data){
                getRatings()
                handleCloseNewRaiting()
            }
        })
        .catch(err => console.warn(err));
    };

    const handleDeleteRating = async (id) => {
        if (window.confirm('Вы действительно хотите удалить?')) {
            const fields = {
                pass1: pass1,
                pass2: pass2,
                pass3: pass3,
            }
            await axios.post(`/del-rating/${id}`, fields)
            .then((data) => {
                if(data){
                    getRatings()
                }
            })
            .catch(err => console.warn(err));
        };
    }

    const deleteUser = async (id) => {
        if (window.confirm('Вы действительно хотите удалить?')) {
            const fields = {
                pass1: pass1,
                pass2: pass2,
                pass3: pass3,
            }
            await axios.post(`/admin/${id}`, fields)
            .then((data) => {
                if(data){
                    getUsers()
                }
            })
            .catch(err => console.warn(err));
        };
    }

    const updateUserSponsor = async (id) => {
        if (window.confirm('Вы действительно хотите дать 30 дней спонсора?')) {
            const fields = {
                pass1: pass1,
                pass2: pass2,
                pass3: pass3,
            }
            await axios.post(`/sponsor/${id}`, fields)
            .then((data) => {
                if(data){
                    getUsers()
                }
            })
            .catch(err => console.warn(err));
        };
    }

    const removeQuestion = async (id) => {
        if (window.confirm('Вы действительно хотите удалить?')) {
            const fields = {
                pass1: pass1,
                pass2: pass2,
                pass3: pass3,
            }
            await axios.post(`/del-quest/${id}`, fields)
            .then((data) => {
                if(data){
                    getQuests()
                }
            })
            .catch(err => console.warn(err));
        };
    };

    const getUsers = async () => {
        const fields = {
            pass1: pass1,
            pass2: pass2,
            pass3: pass3,
        }
        await axios.post('/get-all', fields).then((data) => setUsers(data.data)).catch(err => console.warn(err))
    };

    const getStats = async () => {
        const fields = {
            pass1: pass1,
            pass2: pass2,
            pass3: pass3,
        }
        await axios.post('/stats', fields).then((data) => setStats(data.data)).catch(err => console.warn(err))
    };

    const getTheme = async (theme) => {
        const fields = {
            theme: theme,
            pass1: pass1,
            pass2: pass2,
            pass3: pass3,
        }
        await axios.post(`/theme`, fields)
        .then((data) => {
            setQuestions(data.data)
        })
        .catch(err => console.warn(err));
    };

    return (
        <Grid container sx={{ padding: "15px" }}>
            <Stack
            direction='row'
            justifyContent="space-around"
            alignItems="center"
            sx={{width:'100vw', marginBottom:'15px'}}
            >
                <TextField
                name="word"
                value={pass1}
                onChange={handleChangeWord1}
                label="word"
                type="password"
                />
                <TextField
                name="word"
                value={pass2}
                onChange={handleChangeWord2}
                label="word"
                type="password"
                />
                <TextField
                name="word"
                value={pass3}
                onChange={handleChangeWord3}
                label="word"
                type="password"
                />
            </Stack>
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1}
                sx={{width:'100vw', marginBottom:'15px'}}
            >
                <Button variant="contained" onClick={openRating}>New rating</Button>
                <Button variant="contained" onClick={()=>setOpenDialog(true)}>New question</Button>
                <Button variant="contained" onClick={()=>getQuests()}>Get Quests</Button>
                <Button variant="contained" onClick={()=>getUsers()}>Get Users</Button>
                <Button variant="contained" onClick={()=>getStats()}>Get Stats</Button>
            </Stack>
            <Tabs
                onChange={handleChange}
                value={value}
                aria-label="Tabs where selection follows focus"
                selectionFollowsFocus
            >
                <Tab label="Пользователи" value='1'/>
                <Tab label="Вопросы" value='2'/>
                <Tab label="Статистика" value='3'/>
            </Tabs>
            {value === '1' && users && 
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
                sx={{width:'100vw', margin:'15px'}}
            >
                <TextField value={nick} onChange={handleChangeNick} color="primary" id="input-with-sx" label="Введите никнейм" variant="standard" focused />
                <Button disabled={nick===''} variant="contained" color="primary" onClick={() => searchUser()}>
                    <SearchIcon/>
                </Button>
                <Stack
                direction="column"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
                sx={{width:'100vw', margin:'15px'}}
                >
                    <Typography color="text.secondary">Пользователи: <b>{users.length}</b></Typography>
                    <Typography color="text.secondary">Мужской: <b>{mans.length}</b>&nbsp;&nbsp; Женский: <b>{womans.length}</b></Typography>
                    <Typography color="text.secondary">18‑24 года: <b>{users18.length}</b>&nbsp;&nbsp;
                    25‑34 года: <b>{users25.length}</b>&nbsp;&nbsp;
                    35‑44 года: <b>{users35.length}</b>&nbsp;&nbsp;
                    45-54 года: <b>{users45.length}</b>&nbsp;&nbsp;
                    старше 55 лет: <b>{users55.length}</b></Typography>
                </Stack>
            </Stack>}
            
            {value === '2' && ratings && <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1}
                sx={{width:'100vw', marginBottom:'15px'}}
            >
                {ratings.map((rating, index) =>
                    <Button variant='outlined' key={index} onClick={()=>getTheme(rating.theme)} endIcon={rating.forSponsor && <MonetizationOnIcon />}>{rating.theme}</Button>
                )}
            </Stack>}
            <TableContainer component={Paper}>
                {value === '1' && users && <UsersTable users={users} remove={deleteUser} update={updateUserSponsor}/>}
                {value === '2' && questions && <QuestionsTable questions={questions} getTheme={getTheme} remove={removeQuestion}/>}
                {value === '3' && stats && <StatsTable stats={stats}/>}
            </TableContainer>
            <NewQuestion open={openDialog} handleClose={handleCloseDialog} newQuestion={newQuestion} ratings={ratings}/>
            <NewRating open={openNewRating} handleClose={handleCloseNewRaiting} newRaiting={newRaiting} ratings={ratings} handleDelete={handleDeleteRating}/>
        </Grid>
    );
}