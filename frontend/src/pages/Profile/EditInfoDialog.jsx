import { Button, CardMedia, Dialog, DialogActions, FormControl, IconButton, InputLabel, List, ListItem, ListItemText, MenuItem, Select, Slide, Stack, TextField, Typography } from '@mui/material'
import React from 'react'
import { useDispatch } from 'react-redux'

import { fetchAuthMe } from '../../redux/slices/auth.js'
import axios from '../../axios.js'

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DoneIcon from '@mui/icons-material/Done';
import AccountCircle from '@mui/icons-material/AccountCircle';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const EditInfoDialog = ({ open, handleClose, onSuccess, user }) => {
    const [content, setContent] = React.useState('info')
    const [ username, setFullname ] = React.useState('');
    const [ status, setStatus ] = React.useState('');
    const [ userage, setAge ] = React.useState('');
    const [ usergender, setGender ] = React.useState('');
    const [ usercity, setCity ] = React.useState('');
    const inputFileRef = React.useRef(null);
    const dispatch = useDispatch()

    const handleChangeName = (event) => {
        setFullname(event.target.value);
    };

    const handleChangeStatus = (event) => {
        setStatus(event.target.value);
    };

    const handleChangeAge = (event) => {
        setAge(event.target.value);
    };

    const handleChangeGender = (event) => {
        setGender(event.target.value);
    };

    const handleChangeCity = (event) => {
        setCity(event.target.value);
    };

    function formatDate(milliseconds) {
        const date = new Date(milliseconds);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяц начинается с 0, поэтому добавляем 1
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
      }

    const handleChangeFile = async (event) => {
        try {
            const formData = new FormData();
            const file = event.target.files[0];
            formData.append('image', file);
            axios.post('/upload', formData).then((data) => {
                if(data){
                    onSuccess('Аватар загружен', 'success')
                    dispatch(fetchAuthMe())
                }
            });
            
        } catch (err) {
            console.warn(err)
            onSuccess('Ошибка при загрузке файла', 'error')
        }
    }

    const onCloseDialog = () => {
        setContent('info')
        handleClose()
    }

    const onSubmit = async () => {
        let fullname = user.fullname
        let profileStatus = user.profileStatus
        let age = user.age
        let gender = user.gender
        let city = user.city
        if(username !== '') fullname = username
        if(status !== '') profileStatus = status
        if(userage !== '') age = userage
        if(usergender !== '') gender = usergender
        if(usercity !== '') city = usercity

        const fields = { fullname, profileStatus, age, gender, city } 
        
        await axios.patch(`/auth-data`, fields).then((data) => {
            if(data){
                onSuccess('Данные добавлены', 'success')
                setContent('info')
            }
        }).catch((err)=>{
            if(err) {
                onSuccess('Данные не добавлены', 'error')
                setContent('info')
            }
        });
        setFullname('')
        setStatus('')
        setAge('')
        setGender('')
        setCity('')
        dispatch(fetchAuthMe())
        handleClose()
    };

    return (
        <Dialog
            fullWidth
            maxWidth={'xs'}
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            {user && <>{user.pic === 'none'?
                <Stack sx={{ height: 150, width:'100%' }} justifyContent='center' alignItems='center'>
                    <AccountCircle color="disabled" sx={{ fontSize: 80 }} />
                </Stack>:
                <CardMedia
                sx={{ height: 300 }}
                image={`http://localhost:5000${user.pic}`}
            />}</>}
            {user && (
                <List>
                    <Stack alignItems='center' justifyContent='center'>
                        <Button variant='outlined' onClick={() => inputFileRef.current.click()}>{user.pic === 'none' ? 'Загрузить аватар':'Обновить аватар'}</Button>
                    </Stack>
                    {user.status === 'sponsor' && 
                        <Typography variant='body2' align='center'><br/>Спонсор до {formatDate(user.statusDate)}</Typography>}
                    <input
                        ref={inputFileRef}
                        type='file'
                        onChange={handleChangeFile}
                        hidden
                    />
                    {content === "editName" ? (
                        <ListItem
                        secondaryAction={
                            <IconButton edge="end" onClick={() => setContent('info')}>
                                <DoneIcon/>
                            </IconButton>
                        }
                        >
                            <TextField
                                label="Полное имя"
                                value={username}
                                onChange={handleChangeName}
                                fullWidth
                            />
                        </ListItem>
                        ) : (
                        <ListItem
                        secondaryAction={
                            <IconButton edge="end" onClick={() => setContent('editName')}>
                                <EditOutlinedIcon/>
                            </IconButton>
                        }>
                            <ListItemText
                                primary={
                                    <Typography variant="caption">
                                        Полное имя
                                        <br />
                                    </Typography>
                                }
                                secondary={
                                username === '' ?
                                    <Typography variant="body1">
                                        {user.fullname === "none"
                                            ? "Не указано"
                                            : user.fullname}
                                    </Typography>:
                                    <Typography variant="body1">
                                        {username}
                                    </Typography>
                                    }
                            />
                        </ListItem>
                    )}
                    {content === "editStatus" ? (
                        <ListItem
                        secondaryAction={
                            <IconButton edge="end" onClick={() => setContent('info')}>
                                <DoneIcon/>
                            </IconButton>
                        }
                        >
                            <TextField
                                label="Сведения"
                                helperText="до 150 символов"
                                value={status}
                                onChange={handleChangeStatus}
                                fullWidth
                                multiline
                                maxRows={3}
                                inputProps={{ maxLength: 150 }}
                            />
                        </ListItem>
                        ) : (
                        <ListItem
                        secondaryAction={
                            <IconButton edge="end" onClick={() => setContent('editStatus')}>
                                <EditOutlinedIcon/>
                            </IconButton>
                        }>
                            <ListItemText
                                primary={
                                    <Typography variant="caption">
                                        Текущие сведения
                                        <br />
                                    </Typography>
                                }
                                secondary={
                                status === '' ?
                                    <Typography variant="body1">
                                        {user.profileStatus === "none"
                                            ? "Нет сведений"
                                            : <i>{user.profileStatus}</i>}
                                    </Typography>:
                                    <Typography variant="body1">
                                        <i>{status}</i>
                                    </Typography>
                                    }
                            />
                        </ListItem>
                    )}
                    {content === "editAge" ? (
                        <ListItem
                        secondaryAction={
                            <IconButton edge="end" onClick={() => setContent('info')}>
                                <DoneIcon/>
                            </IconButton>
                        }
                        >
                        <FormControl fullWidth>
                            <InputLabel id="select-label">Возраст</InputLabel>
                            <Select
                                labelId="select-label"
                                label="Возраст"
                                value={userage}
                                onChange={handleChangeAge}
                            >
                                <MenuItem value={"18‑24 года"}>
                                    18‑24 года
                                </MenuItem>
                                <MenuItem value={"25‑34 года"}>
                                    25‑34 года
                                </MenuItem>
                                <MenuItem value={"35‑44 года"}>
                                    35‑44 года
                                </MenuItem>
                                <MenuItem value={"45-54 года"}>
                                    45-54 года
                                </MenuItem>
                                <MenuItem value={"старше 55 лет"}>
                                    старше 55 лет
                                </MenuItem>
                            </Select>
                        </FormControl>
                        </ListItem>
                        ) : (
                        <ListItem
                        secondaryAction={
                            <IconButton edge="end" onClick={() => setContent('editAge')}>
                                <EditOutlinedIcon/>
                            </IconButton>
                        }>
                            <ListItemText
                            primary={
                                <Typography variant="caption">
                                    Возраст
                                    <br />
                                </Typography>
                            }
                            secondary={userage === '' ? <Typography variant="body1">
                                    {user.age === "none"
                                        ? "Не указан"
                                        : user.age}
                                </Typography>:
                                <Typography variant="body1">
                                    {userage}
                                </Typography>}
                        />
                    </ListItem>
                    )}
                    {content === "editGender" ? (
                        <ListItem
                        secondaryAction={
                            <IconButton edge="end" onClick={() => setContent('info')}>
                                <DoneIcon/>
                            </IconButton>
                        }
                        >
                            <FormControl fullWidth>
                                <InputLabel id="select">Пол</InputLabel>
                                <Select
                                    labelId="select"
                                    label="Пол"
                                    value={usergender}
                                    onChange={handleChangeGender}
                                >
                                    <MenuItem value={"Мужской"}>Мужской</MenuItem>
                                    <MenuItem value={"Женский"}>Женский</MenuItem>
                                </Select>
                            </FormControl>
                        </ListItem>
                        ) : (
                        <ListItem
                        secondaryAction={
                            <IconButton edge="end" onClick={() => setContent('editGender')}>
                                <EditOutlinedIcon/>
                            </IconButton>
                        }>
                            <ListItemText
                                primary={
                                    <Typography variant="caption">
                                        Пол
                                        <br />
                                    </Typography>
                                }
                                secondary={usergender === "" ? <Typography variant="body1">
                                        {user.gender === "none"
                                            ? "Не указан"
                                            : user.gender}
                                    </Typography>:
                                    <Typography variant="body1">
                                        {usergender}
                                    </Typography>}
                            />
                        </ListItem>
                    )}
                    {content === "editCity" ? (
                        <ListItem
                        secondaryAction={
                            <IconButton edge="end" onClick={() => setContent('info')}>
                                <DoneIcon/>
                            </IconButton>
                        }
                        >
                            <TextField
                                label="Город"
                                value={usercity}
                                onChange={handleChangeCity}
                                fullWidth
                            />
                        </ListItem>
                        ) : (
                        <ListItem
                        secondaryAction={
                            <IconButton edge="end" onClick={() => setContent('editCity')}>
                                <EditOutlinedIcon/>
                            </IconButton>
                        }>
                            <ListItemText
                                primary={
                                    <Typography variant="caption">
                                        Город
                                        <br />
                                    </Typography>
                                }
                                secondary={usercity === '' ? <Typography variant="body1">
                                        {user.city === "none"
                                            ? "Не указан"
                                            : user.city}
                                    </Typography>:
                                    <Typography variant="body1">
                                        {usercity}
                                    </Typography>}
                            />
                        </ListItem>
                    )}
                </List>
            )}
            <DialogActions>
                <Button onClick={onSubmit} >OK</Button>
                <Button onClick={onCloseDialog}>Отмена</Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditInfoDialog