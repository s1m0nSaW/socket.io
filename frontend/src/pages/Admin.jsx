import { Button, Card, CardActions, CardContent, CardHeader, Grid, IconButton, List, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ToggleButton, ToggleButtonGroup, Toolbar, Typography } from '@mui/material';
import React from 'react';
import axios from "../axios.js";

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';

import CreatePostDialog from '../components/PostDialog.jsx';
import PartnersTable from '../components/PartnersTable.jsx';

export const Admin = () => {
    const [ pass, setPass ] = React.useState('');
    const [ requests, setRequests ] = React.useState('');
    const [ partners, setPartners ] = React.useState('');
    const [ posts, setPosts ] = React.useState();
    const [ users, setUsers ] = React.useState();
    const [ content, setContent ] = React.useState('reqs');
    const [ openDialog, setOpenDialog ] = React.useState(false);

    const handleChange = (event, newAlignment) => {
        setContent(newAlignment);
      };

    const handleChangeWord = (e) => {
        const w = e.target.value
        setPass(w)
    }

    const paids = users?.filter(obj => obj.paymentStatus === "succeeded");
    const mans = users?.filter(obj => obj.gender === "Мужской");
    const womans = users?.filter(obj => obj.gender === "Женский");
    const users18 = users?.filter(obj => obj.age === "18‑24 года");
    const users25 = users?.filter(obj => obj.age === "25‑34 года");
    const users35 = users?.filter(obj => obj.age === "35‑44 года");
    const users45 = users?.filter(obj => obj.age === "45-54 года");
    const users55 = users?.filter(obj => obj.age === "старше 55 лет");


    const handlePosts = (p) => {
        setPosts(p);
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
    }

    const getPosts = async () => {
        const fields = {
            pass: pass
        }
        await axios.post('/admi/posts', fields).then((data) => setPosts(data.data.reverse())).catch(err => console.warn(err))
    }

    const getPartners = async () => {
        const fields = {
            pass: pass
        }
        await axios.post('/admi/partners', fields).then((data) => setPartners(data.data.reverse())).catch(err => console.warn(err))
    }

    const deletePost = async (id) => {
        const fields = { pass: pass }
        await axios.post(`/admi/delete-post/${id}`,fields).then((data) => {if(data)getPosts()}).catch((err) => console.error(err));
    }

    const deletePartner = async (id) => {
        const fields = { pass: pass }
        await axios.post(`/admi/delete-partner/${id}`,fields).then((data) => {if(data)getPartners()}).catch((err) => console.error(err));
    }

    const updateStatus = async ( _id, status ) => {
        const fields = {_id, status, pass: pass }
        await axios.patch('/admi/requests', fields).then((data) => setRequests(data.data.reverse())).catch(err => console.warn(err))
    }

    const formatDate = (milliseconds) => {
        const dt = new Date(milliseconds);
        const formattedDate = dt.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        });
        return formattedDate;
    }

    React.useEffect(()=>{
        const getRequests = async () => {
            const fields = {
                pass: pass
            }
            await axios.post('/admi/requests', fields).then((data) => setRequests(data.data.reverse())).catch(err => console.warn(err))
            await axios.post('/admi/posts', fields).then((data) => setPosts(data.data.reverse())).catch(err => console.warn(err))
            await axios.post('/admi/partners', fields).then((data) => setPartners(data.data.reverse())).catch(err => console.warn(err))
            await axios.post('/get-all', fields).then((data) => setUsers(data.data)).catch(err => console.warn(err))
        }
        getRequests()
    },[pass])

    return (
        <Grid container sx={{ padding: "15px" }}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{width:'100vw'}}
            >
                <TextField
                    name="word"
                    value={pass}
                    onChange={handleChangeWord}
                    label="word"
                    type="password"
                />
                <ToggleButtonGroup
                    color="primary"
                    value={content}
                    exclusive
                    onChange={handleChange}
                    aria-label="Platform"
                >
                    <ToggleButton value="posts">Посты</ToggleButton>
                    <ToggleButton value="reqs">Заявки</ToggleButton>
                    <ToggleButton value="partners">Партнеры</ToggleButton>
                </ToggleButtonGroup>
                <Button onClick={() => setOpenDialog(true)}>New Post</Button>
            </Stack>
            {users && <Stack
                direction="column"
                justifyContent="space-between"
                alignItems="center"
                sx={{width:'100vw'}}
            >
                <Typography color="text.secondary">Пользователи: {users.length}</Typography>
                <Typography color="text.secondary">Оплаченные: {paids.length}</Typography>
                <Typography color="text.secondary">Мужской: {mans.length}&nbsp;&nbsp; Женский: {womans.length}</Typography>
                <Typography color="text.secondary">18‑24 года: {users18.length}&nbsp;&nbsp;
                25‑34 года: {users25.length}&nbsp;&nbsp;
                35‑44 года: {users35.length}&nbsp;&nbsp;
                45-54 года: {users45.length}&nbsp;&nbsp;
                старше 55 лет: {users55.length}</Typography>
            </Stack>}
            <Toolbar />
            {content === "reqs" && (
                <TableContainer component={Paper}>
                    {requests && (
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Сумма</TableCell>
                                    <TableCell align="right">Дата</TableCell>
                                    <TableCell align="right">Статус</TableCell>
                                    <TableCell align="right">
                                        Получатель
                                    </TableCell>
                                    <TableCell align="right">
                                        Номеркарты
                                    </TableCell>
                                    <TableCell align="right">Банк</TableCell>
                                    <TableCell align="right">
                                        Днйствие
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {requests.map((request, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            "&:last-child td, &:last-child th":
                                                {
                                                    border: 0,
                                                },
                                        }}
                                    >
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell component="th" scope="row">
                                            {request.amount}
                                        </TableCell>
                                        <TableCell align="right">
                                            {request.createdAt}
                                        </TableCell>
                                        <TableCell align="right">
                                            {request.status}
                                        </TableCell>
                                        <TableCell align="right">
                                            {request.requisites.userName}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography
                                                variant="body3"
                                                sx={{ userSelect: "text" }}
                                            >
                                                {request.requisites.cardNumber}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            {request.requisites.bankName}
                                        </TableCell>
                                        <TableCell align="right">
                                            {request.status ===
                                                "Принята к исполнению" && (
                                                <Button
                                                    onClick={() =>
                                                        updateStatus(
                                                            request._id,
                                                            "В работе"
                                                        )
                                                    }
                                                    size="small"
                                                    variant="outlined"
                                                    color="inherit"
                                                >
                                                    Взять в работу
                                                </Button>
                                            )}
                                            {request.status === "В работе" && (
                                                <Button
                                                    onClick={() =>
                                                        updateStatus(
                                                            request._id,
                                                            "Выполнена"
                                                        )
                                                    }
                                                    size="small"
                                                    variant="outlined"
                                                    color="inherit"
                                                >
                                                    Выполнена
                                                </Button>
                                            )}
                                            {request.status === "Выполнена" && (
                                                <CheckBoxIcon fontSize="small" />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </TableContainer>
            )}
            {content === "posts" && (
                <List component={Paper} sx={{width:'100vw'}}>
                    {posts?.map((post, index) => (
                            <Card key={index} sx={{ margin:'10px', width:'90%'}}>
                                <CardHeader
                                    title={formatDate(post.date)}
                                />
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary">
                                        {post.text}
                                    </Typography>
                                </CardContent>
                                <CardContent>
                                    <Stack
                                    direction="row"
                                    justifyContent="flex-end"
                                    alignItems="center"
                                    spacing={2}
                                    ><ThumbUpAltIcon fontSize="small" />&nbsp; {post.positive.length} &nbsp;
                                    <ThumbDownAltIcon fontSize="small" />&nbsp; {post.negative.length} 
                                    </Stack>
                                </CardContent>
                                <CardActions>
                                    <IconButton
                                        edge="end"
                                        aria-label="comments"
                                        onClick={()=>deletePost(post._id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        )
                    )}
                </List>
            )}
            {content === "partners" && (<PartnersTable partners={partners} deletePartner={deletePartner}/>)}
            <CreatePostDialog
                open={openDialog}
                handleClose={handleCloseDialog}
                pass={pass}
                setPosts={handlePosts}
            />
        </Grid>
    );
}