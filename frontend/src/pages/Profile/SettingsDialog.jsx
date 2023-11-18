import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, ListItem, ListItemText, Slide, TextField, Typography } from '@mui/material'
import React from 'react'
import { useDispatch } from 'react-redux'

import { fetchAuthMe } from '../../redux/slices/auth.js'
import axios from '../../axios.js'

import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const SettingsDialog = ({ open, handleClose, onSuccess, user }) => {
    const dispatch = useDispatch()

    const [nickname, setNickname] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [edit, setEdit] = React.useState(0);
    const [passwordErr, setPasswordErr] = React.useState(true);
    const [nickErr,  setNickErr] = React.useState(true);
    const [emailErr, setEmailErr] = React.useState(true);

    const handleEditClick = (position) => {
        setEdit(position)
    }

    const handleChangeNickname = (e) => {
        const nick = e.target.value
        setNickname(nick)
        if(nick.length >= 5){
            setNickErr(false)
        } else {
            setNickErr(true)
        }
    }

    const handleChangeEmail = (e) => {
        const email = e.target.value
        setEmail(email)
        if(email.length >= 8){
            setEmailErr(false)
        } else {
            setEmailErr(true)
        }
    }

    const handleChangePassword = (e) => {
        const pass = e.target.value
        setPassword(pass)
        if(pass.length >= 5){
            setPasswordErr(false)
        } else {
            setPasswordErr(true)
        }
    }

    const onExit = () => {
        setEdit(0)
        handleClose()
    }

    const updateData = async (type) => {
        if (type === 'nickname'){
            const fields = {nickname}
            await axios.patch(`/auth-nick`,fields).then((data) => {
                if(data){
                    dispatch(fetchAuthMe())
                    setEdit(0)
                    onSuccess('Никнейм обновлен', 'success')
                }
            }).catch((err)=>{
                if(err) onSuccess(err.response.data.message, 'error')
            });
        }

        if (type === 'email'){
            const fields = {email}
            await axios.patch(`/auth-email`,fields).then((data) => {
                if(data){
                    dispatch(fetchAuthMe())
                    setEdit(0)
                    onSuccess('E-mail обновлен', 'success')
                }
            }).catch((err)=>{
                if(err.response.data.message) {
                    onSuccess(err.response.data.message, 'error')
                } else {
                    onSuccess('Ошибка обновления e-mail', 'error')
                }
            });
        }

        if (type === 'password'){
            const fields = { password }
            await axios.patch(`/auth-pass`,fields).then((data) => {
                if(data){
                    dispatch(fetchAuthMe())
                    setEdit(0)
                    onSuccess('Пароль обновлен', 'success')
                }
            }).catch((err)=>{
                console.warn(err)
                if(err) onSuccess(err.response.data.message, 'error')
            });
        }
    }

    return (
        <Dialog
            fullScreen
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={onExit}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>Настройки</DialogTitle>
            <DialogContent sx={{width:'100%'}}>
                {edit === 1 ? 
                <ListItem
                    disableGutters
                    secondaryAction={
                    <IconButton disabled={nickErr} edge="end" onClick={()=>updateData('nickname')}>
                      <CheckIcon />
                    </IconButton>
                    }
                >
                    <TextField 
                        name='nickname' 
                        value={nickname} 
                        onChange={handleChangeNickname}
                        label="Новый никнейм"
                        error={nickErr}
                        helperText='Никнейм должен быть минимум из 5 символов'
                    />
                </ListItem>
                :
                <ListItem
                    disableGutters
                    secondaryAction={
                    <IconButton edge="end" onClick={()=>handleEditClick(1)}>
                      <EditIcon />
                    </IconButton>
                    }
                >
                    <ListItemText 
                        primary={<Typography variant='caption'>Никнейм:<br/></Typography>} 
                        secondary={<Typography variant='body1'>{user?.nickname}</Typography>}
                    />
                </ListItem>
                }
                {edit === 2 ? 
                <ListItem
                    disableGutters
                    secondaryAction={
                    <IconButton disabled={emailErr} edge="end" onClick={()=>updateData('email')}>
                      <CheckIcon />
                    </IconButton>
                    }
                >
                    <TextField 
                        name='email' 
                        value={email} 
                        onChange={handleChangeEmail}
                        label='Новый e-mail'
                        error={emailErr}
                        type='email'

                    />
                </ListItem>
                :
                <ListItem
                    disableGutters
                    secondaryAction={
                    <IconButton edge="end" onClick={()=>handleEditClick(2)}>
                      <EditIcon />
                    </IconButton>
                    }
                >
                    <ListItemText 
                        primary={<Typography variant='caption'>E-mail:<br/></Typography>} 
                        secondary={<Typography variant='body1'>{user?.email}</Typography>}
                    />
                </ListItem>
                }
                {edit === 3 ? 
                <ListItem
                    disableGutters
                    secondaryAction={
                    <IconButton disabled={passwordErr} edge="end" onClick={()=>updateData('password')}>
                      <CheckIcon />
                    </IconButton>
                    }
                >
                    <TextField 
                        name='password' 
                        value={password} 
                        onChange={handleChangePassword}
                        label='Новый пароль'
                        error={passwordErr}
                        helperText='Пароль должен быть минимум из 5 символов'
                    />
                </ListItem>
                :
                <ListItem
                    disableGutters
                    secondaryAction={
                    <IconButton edge="end" onClick={()=>handleEditClick(3)}>
                      <EditIcon />
                    </IconButton>
                    }
                >
                    <ListItemText 
                        primary={<Typography variant='caption'>Пароль:<br/></Typography>} 
                        secondary={<Typography variant='body1'>******</Typography>}
                    />
                </ListItem>
                }
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onExit}
                >
                    Отмена
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default SettingsDialog